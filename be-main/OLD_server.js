const express = require("express");
const cors = require("cors");
const User = require("./db/model/UserModel");
const {
  createLinkToken,
  // tokenExchange,
} = require("../be-main/controllers/controller");
const db = require("./db/db");
const passport = require("passport");
const session = require("express-session");
const dotenv = require("dotenv");
// const {
//   createLinkToken,
//   exchangePublicToken,
// } = require("./models/plaid_model");

dotenv.config({ path: "./config.env" });

require("./config/passport")(passport);

db();

const {
  createUser,
  getAllUsers,
  tokenExchange,
} = require("./controllers/controller");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// function ensureAuthenticated(req, res, next) {
//   if (req.isAuthenticated()) {
//     return next();
//   }

//   res.redirect("http://localhost:3000");
// }

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("http://localhost:3000/dashboard");
  }
);

app.get("/api/users", getAllUsers);

app.post("/api/users", createUser);

app.post("/api/create_link_token", createLinkToken);

// tokenExchange --> exchangePublicToken
app.post("/api/exchange_public_token", tokenExchange);

module.exports = app;
