
// =================================================================================

//server.js
app.post("/api/create_link_token", createLinkToken);
// forget - does this post the response back to client ?? 
// or do we add something here eg: .send(link_token)

app.post("/api/send_public_token", tokenExchange);

// =================================================================================


//controller.js
exports.createLinkToken = (req, res, next) => {
    postCreateLink()
      .then((link_token) => {
        res.status(200).send(link_token);
      })
      .catch((err) => {
          console.log(err);
        });
};

exports.tokenExchange = (req, res, next) => {
    console.log(req);
    const public_token = req.body.public_token;
    postTokenExchange(public_token)
    .then((result)=>{
        res.status(200).send(result);
    })
    .cath((err)=>{
        console.log(err);
    })
};

// =================================================================================

// config.env
PLAID_ID="641d4c402b1dac0013438df7"
PLAID_SANDBOX_SECRET="fc439113c9621b64a6ad6bb0857a19"

// =================================================================================

  //plaid_model.js
const axios = require('axios');
const { Configuration, PlaidApi, Products, PlaidEnvironments} = require('plaid');
const uuid = require('uuid');


const plaidHeaders = {
    'PLAID-CLIENT-ID': process.env.PLAID_ID,
    'PLAID-SECRET': process.env.PLAID_SANDBOX_SECRET,
    'Plaid-Version': '2020-09-14',
  };

// Initialize the Plaid client
const configuration = new Configuration({
  basePath: PlaidEnvironments['sandbox'],
  baseOptions: {
    headers: plaidHeaders,
  }, 
});
const client = new PlaidApi(configuration);

const plaidApi = axios.create({
  baseURL: `${client.basePath}/`,
});


const configs = {
  user: {client_user_id: 'PlaidPal SandBox Client'},
  client_name: 'user_good',
  language: 'en',
}

const configsForLinkTokenCreate = {
  user: "PlaidPal SandBox Client",
  client_name: "user_good",
  language: "en",
  products : ["transactions"],
  country_codes: ["US"],
  // redirect_uri: //probably no needed - see notes in quickstart index.js 
  };


exports.postCreateLink = () =>{
    // return plaidApi.post('/link/token/create', configsForLinkTokenCreate, {"headers": plaidHeaders})
    // .then ((response)=>{
    return client.linkTokenCreate(configsForLinkTokenCreate)
    .then ((response)=>{
        console.log('linktokencreate worked');
        // console.log(response);
        return response.data.link_token;
    })
    // });
};



exports.postTokenExchange = (publicToken) => {
    configForExchange = {
      client_id: process.env.PLAID_ID,
      secret: process.env.PLAID_SANDBOX_SECRET,
      public_token: publicToken,
    };

    return client.itemPublicTokenExchange({public_token: publicToken})
    .then((result)=>{
        console.log('itemPublicTokenExchange worked');
        let returnObj = {
            access_token: result.data.access_token,
            item_id: result.data.item_id,
            error: null
        };
        // return {returnObj}; // see quickstart code - says this never goes to client
        return {};
    });

    // TBD - other possibl ways to achieve above...
    // return plaidApi.post('/item/public_token/exchange', configForExchange)
    //   return plaidApi.post('exchange_public_token', configForExchange, {"headers": headers})
    //   .then ((response)=>{
    //     console.log('sucess of token exchange');
    //   })
  }

// =================================================================================
