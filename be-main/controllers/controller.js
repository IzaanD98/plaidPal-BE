const { postUser, fetchAllUsers } = require("../models/mongo_models");
const {
  postCreateLink,
  postTokenExchange,
  fetchPlaidAccounts,
  fetchTransactions,
} = require("../models/plaid_model");

exports.getAllUsers = (req, res, next) => {
  fetchAllUsers()
    .then((results) => {
      res.status(200).send(results);
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.createUser = (req, res, next) => {
  const newUser = req.body;
  postUser(newUser, userId)
    .then((results) => {
      res.status(201).send({ message: results });
    })
    .catch((err) => {
      console.log(err);
    });
};

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
  const obj = req.body;
  // console.log(public_token);
  postTokenExchange(obj)
    .then((result) => {
      // console.log(result);
      res.status(200).send(result);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getPlaidAccounts = (req, res, next) => {
  const obj = req.body;
  fetchPlaidAccounts(obj)
    .then((accounts) => {
      res.status(200).send(accounts);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getTransactions = (req, res, next) => {
  const obj = req.body;
  fetchTransactions(obj)
    .then((transactions) => {
      res.status(200).send(transactions);
    })
    .catch((err) => {
      console.log(err);
    });
};
