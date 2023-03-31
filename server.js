const express = require("express");
const cors = require("cors");
const User = require("./db/model/UserModel");
const {
  createLinkToken,
  tokenExchange,
  getPlaidAccounts,
  getTransactions,
} = require("./controllers/controller");
const db = require("./db/db");
const passport = require("passport");
const session = require("express-session");
const dotenv = require("dotenv");

const { OAuth2Client } = require("google-auth-library");  // npm install this on pp-be
const jwt = require("jsonwebtoken"); // this needs installing too




dotenv.config({ path: "./config.env" });

require("./config/passport")(passport);

db();

const {
  createUser,
  getAllUsers,
  getUserById,
  deleteUserById,
  postNoteByTransactionId,
} = require("./controllers/controller");

const app = express();

// app.use(cors());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: "GET,POST,PUT,DELETE,OPTIONS",
  })
);   // Hmmmmmm :D   Deployed, this will be different. 



app.use(express.json());

app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
  })
);

// app.use(passport.initialize());
// app.use(passport.session());

// app.get(
//   "/auth/google",
//   passport.authenticate("google", {
//     scope: ["profile", "email"],
//   })
// );

// app.get(
//   "/auth/google/callback",
//   passport.authenticate("google", { failureRedirect: "/" }),
//   (req, res) => {
//     res.redirect("http://localhost:3000/dashboard");
//   }
// );

app.get("/api/users", getAllUsers);

app.get("/api/users/:googleId", getUserById);

app.delete("/api/users/:googleId", deleteUserById);

app.post("/api/users", createUser);

app.post("/api/create_link_token", createLinkToken);

app.post("/api/exchange_public_token", tokenExchange);

app.post("/api/plaid/accounts", getPlaidAccounts);

app.post("/api/plaid/transactions", getTransactions);

app.post("/api/notes/:transaction_id", postNoteByTransactionId);


const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

async function verifyGoogleToken(token) {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID,
    });
    return { payload: ticket.getPayload() };
  } catch (error) {
    return { error: "Invalid user detected. Please try again" };
  }
}
/** to here */



app.post("/api/signup", async (req, res) => {
  console.log(req.body);
  console.log(req.body.credential);
  try {
    if (req.body.credential !== null) {
      const verificationResponse = await verifyGoogleToken(req.body.credential);
      console.log(verificationResponse);
      if (verificationResponse.error) {
        console.log('we got error on verifygoogletoken' + verificationResponse.error);
        return res.status(400).json({ message: verificationResponse.error });
      }
      const profile = verificationResponse?.payload;
      User.create(profile)
        .then(() => {
          console.log('success adding profile to db');
          console.log(profile);
          res.status(201).json({
            message: "Signup was successful",
            user: {
              firstName: profile?.given_name,
              lastName: profile?.family_name,
              picture: profile?.picture,
              email: profile?.email,
              token: jwt.sign({ email: profile?.email }, "myScret", {
                expiresIn: "1d",
              }),
            },
          });
        })
        .catch((error) => {
    console.log(error);
    console.log('plaidPal error 1st catch:');

          res
            .status(500)
            .json({ message: "An error occurred. Registration failed. 1" });
        });
    }
  } catch (error) {
    console.log('plaidPal error 2nd catch:');
    console.log(error);
    res
      .status(500)
      .json({ message: "An error occurred. Registration failed. 2" });
  }
});



/** Another route to add, and another function to add to the controller googleAuth..... 
* prepend /api to the route eg. /api/login
*/
app.post("/api/login", async (req, res) => {
  console.log(req.body);
  console.log(req.body.credential);

  try {
    if (req.body.credential !== null) {
      console.log(req.body);
      console.log(req.body.credential);
      const verificationResponse = await verifyGoogleToken(req.body.credential);
      console.log("verificationResponse");
      console.log(verificationResponse);
      if (verificationResponse.error) {
        return res.status(400).json({
          message: verificationResponse.error,
        });
      }

      const profile = verificationResponse?.payload;

      // const existsInDB = DB.find((person) => person?.email === profile?.email); // perhaps findUserByID/Email/something? in the  user model :)
      // let existsInDB = "";
      // User.find({email:profile?.email}).then((result)=>{
      //   existsInDB = result;
      // });

      let existsInDB = await User.find({email: profile?.email})
      console.log(existsInDB);
      if (!existsInDB) {
        return res.status(400).json({
          message: "You are not registered. Please sign up",
        });
      }
      res.status(201).json({
        message: "Login was successful",   // the user object will be the one returned from the DB and not hard coded
        user: {
          firstName: profile?.given_name,
          lastName: profile?.family_name,
          picture: profile?.picture,
          email: profile?.email,
          token: jwt.sign({ email: profile?.email }, process.env.JWT_SECRET, {
            expiresIn: "1d",
          }),
        },
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error?.message || error,
    });
  }
});




module.exports = app;
