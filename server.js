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

dotenv.config({ path: "./config.env" });

require("./config/passport")(passport);

db();

const {
  createUser,
  getAllUsers,
  getUserById,
  deleteUserById,
} = require("./controllers/controller");

const app = express();

app.use(cors());
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

app.get("/api/users/:googleId", getUserById);

app.delete("/api/users/:googleId", deleteUserById);

app.post("/api/users", createUser);

app.post("/api/create_link_token", createLinkToken);

app.post("/api/exchange_public_token", tokenExchange);

app.post("/api/plaid/accounts", getPlaidAccounts);

app.post("/api/plaid/transactions", getTransactions);

module.exports = app;
