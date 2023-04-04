const axios = require("axios");
const {
  Configuration,
  PlaidApi,
  Products,
  PlaidEnvironments,
} = require("plaid");
const uuid = require("uuid");
const User = require("../db/model/UserModel");

const plaidHeaders = {
  "PLAID-CLIENT-ID": process.env.PLAID_ID,
  "PLAID-SECRET": process.env.PLAID_SANDBOX_SECRET,
  "Plaid-Version": "2020-09-14",
};

// Initialize the Plaid client
const configuration = new Configuration({
  basePath: PlaidEnvironments["sandbox"],
  baseOptions: {
    headers: plaidHeaders,
  },
});
const client = new PlaidApi(configuration);

const plaidApi = axios.create({
  baseURL: `${client.basePath}/`,
});

const configs = {
  user: { client_user_id: "PlaidPal SandBox Client" },
  client_name: "user_good",
  language: "en",
};

const configsForLinkTokenCreate = {
  user: { client_user_id: "PlaidPal SandBox Client" },
  client_name: "user_good",
  language: "en",
  products: ["transactions"],
  country_codes: ["GB"],
  // country_codes: ["ERROR_COUNTRY_CODE"], //for error testing - change with above line
};

exports.postCreateLink = () => {
  return plaidApi
    .post("/link/token/create", configsForLinkTokenCreate, {
      headers: plaidHeaders,
    })
    .then((response) => {
      return client
        .linkTokenCreate(configsForLinkTokenCreate)
        .then((response) => {
          return response.data;
        });
    });
};

exports.postTokenExchange = (obj) => {
  return new Promise((resolve, reject) => {
    client
      .itemPublicTokenExchange({ public_token: obj.token })
      .then((result) => {
        const access_token = result.data.access_token;
        User.updateOne(
          { googleId: obj.googleId.toString() },
          { access_token: access_token }
        )
          .then(() => {
            // console.log(returnObj);
            resolve({ message: "access token added to User DB" });
            // return({ message: "access token added to User DB" });
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  });
};

exports.fetchPlaidAccounts = (obj) => {
  const { googleId } = obj;
  let access_token = "";
  return User.find({ googleId: googleId })
    .then((results) => {
      access_token = results[0].access_token;
      return access_token;
    })
    .then((access_token) => {
      return client.accountsGet({ access_token }).then((response) => {
      // return client.accountsGet({ id: "RUBBISH" }).then((response) => { // for error testing
        return new Promise((resolve, reject) => {
          const account_ids = response.data.accounts.map(
            (account) => account.account_id
          );
          User.updateOne({ googleId: googleId }, { account_ids }).then(() => {
            resolve(response.data.accounts);
          });
        });
      });
    });
};

exports.fetchTransactions = (obj, sort_by = "date", order = "desc") => {
  const { googleId } = obj;

  let access_token = "";
  return User.find({ googleId: googleId })
    .then((results) => {
      access_token = results[0].access_token;
      return access_token;
    })
    .then((access_token) => {
      return client
        .transactionsGet({
          access_token: access_token,
          start_date: "2018-01-01",
          // start_date: 12345, // error testing code
          end_date: "2022-02-01",
        })
        .then((response) => {
          let transactions = response.data.transactions;

          if (sort_by === "amount") {
            transactions.sort((a, b) => {
              if (order === "asc") {
                return a.amount - b.amount;
              } else {
                return b.amount - a.amount;
              }
            });
          } else if (sort_by === "date") {
            transactions.sort((a, b) => {
              if (order === "asc") {
                return new Date(a.date) - new Date(b.date);
              } else {
                return new Date(b.date) - new Date(a.date);
              }
            });
          } else if (sort_by === "name") {
            transactions.sort((a, b) => {
              if (order === "asc") {
                return a.name.localeCompare(b.name);
              } else {
                return b.name.localeCompare(a.name);
              }
            });
          }

          return transactions;
        });
    });
};

exports.fetchAllCategories = () => {
  return client.categoriesGet({}).then((response) => {
    return response.data.categories;
  });
};
exports.fetchSingleTransactionAndNote = (idObj, provided_transaction_id) => {
  const { googleId } = idObj;
  let access_token = "";
  let returnObj = { transaction: null, note: {} };

  return User.find({ googleId: googleId })
    .then((results) => {
      access_token = results[0].access_token;
      // console.log(results);
      return access_token;
    })
    .then((access_token) => {
      return client
        .transactionsGet({
          access_token: access_token,
          // access_token: 12345, // error testing
          start_date: "2018-01-01",
          end_date: "2022-02-01",
        })
        .then((response) => {
          const transactionObj = response.data.transactions.filter((tran) => {
            return tran.transaction_id === provided_transaction_id;
          });
          returnObj.transaction = transactionObj;
          return User.find({ googleId: googleId }).then((user) => {
            const noteForTransaction = user[0].notes.filter(
              (noteObj) => noteObj.transaction_id === provided_transaction_id
            )[0];
            console.log(noteForTransaction);
            if(noteForTransaction === undefined){
              returnObj.note = {};
            } else{
              returnObj.note = noteForTransaction;
            }
            return returnObj;
          });
        });
    });
};
