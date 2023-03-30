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
  "PLAID-CLIENT-ID": "641f67871ed5f80013b417bc",
  "PLAID-SECRET": "93b55df53fe9a6e6d00194aa0fae0a",
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

// const createUser = async () => {
//   const user = await User.findOne({ googleId: request.user.googleId });
//   const clientUserId = user._id.toString();
// };

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

exports.postTokenExchange = (publicToken) => {
  return client
    .itemPublicTokenExchange({ public_token: publicToken.token })
    .then((result) => {
      let returnObj = {
        access_token: result.data.access_token,
        item_id: result.data.item_id,
        error: null,
      };
      // return {returnObj}; // see quickstart code - says this never goes to client
      return returnObj;
    });
};

//TEST createLinkToken -->
// exports.createLinkToken = async function (request, response) {
//   console.log(request.user);
//   // Get the client_user_id by searching for the current user
//   // const user = await User.find(...);
//   // const clientUserId = user.id;

//   const user = await User.findOne({ googleId: request.user.googleId });
//   const clientUserId = user._id.toString();
//   // console.log(clientUserId);

//   // const user = await User.find({ id: "642327c10b6d277bc8dca6ac" });
//   // const clientUserId = user.id;

//   // const userId = request.user.googleId.toString();
//   // console.log(userId);

//   const plaidRequest = {
//     user: {
//       // This should correspond to a unique id for the current user.
//       // client_user_id: clientUserId,
//       client_user_id: clientUserId,
//     },
//     client_name: "Plaid Test App",
//     products: ["auth", "transactions"],
//     language: "en",
//     redirect_uri: "http://localhost:3000/",
//     country_codes: ["GB"],
//   };
//   try {
//     const createTokenResponse = await plaidClient.linkTokenCreate(plaidRequest);
//     console.log("Link token created:", createTokenResponse.data.link_token);
//     response.json(createTokenResponse.data);
//   } catch (error) {
//     // handle error
//     console.error("Plaid Error:", error);
//     response.status(500).json({
//       message: "failed",
//     });
//   }
// };

// // exchangePublicToken --> tokenExchange
// exports.exchangePublicToken = async function (request, response, next) {
//   const publicToken = request.body.public_token;
//   try {
//     const plaidResponse = await plaidClient.itemPublicTokenExchange({
//       public_token: publicToken,
//     });

//     // These values should be saved to a persistent database and
//     // associated with the currently signed-in user
//     const accessToken = plaidResponse.data.access_token;
//     // const itemID = response.data.item_id;

//     // const userId = request.user._id;

//     // store the access token to the database
//     const user = await User.findOne({ googleId: request.user.googleId });
//     user.accessToken = accessToken;
//     await user.save();
//     // await User.findByIdAndUpdate(userId, { accessToken });
//     // res.json({ public_token_exchange: "complete" });
//     response.json({ accessToken });
//   } catch (error) {
//     // handle error
//     console.error("Plaid Error:", error);
//     response.status(500).json({
//       message: "failed",
//     });
//   }
// };
