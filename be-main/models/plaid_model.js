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
  // user: "PlaidPal SandBox Client",
  client_name: "user_good",
  language: "en",
  products: ["transactions"],
  country_codes: ["GB"],

  // redirect_uri: //probably no needed - see notes in quickstart index.js
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
          console.log("linktokencreate worked");
          console.log(response.data);
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
        let returnObj = {
          access_token: result.data.access_token,
          item_id: result.data.item_id,
          error: null,
        };
        User.updateOne(
          { googleId: obj.googleId.toString() },
          { access_token: access_token }
        )
          .then(() => {
            console.log(returnObj);
            resolve(returnObj);
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

exports.fetchTransactions = (obj) => {
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
          access_token,
          start_date: "2020-01-01",
          end_date: "2022-02-01",
        })
        .then((response) => {
          console.log(response.data.transactions);
          return response.data.transactions;
        });
    });
};
