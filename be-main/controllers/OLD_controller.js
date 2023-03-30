const { postUser, fetchAllUsers } = require("../models/mongo_models");
const { postCreateLink, postTokenExchange } = require("../models/plaid_model");

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
  postUser(newUser)
    .then((results) => {
      res.status(201).send({ message: results });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.createLinkToken = (req, res, next) => {
  console.log(req.user);

  postCreateLink()
    .then((link_token) => {
      res.status(200).send(link_token);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.tokenExchange = (req, res, next) => {
  const public_token = req.body;
  postTokenExchange(public_token)
    .then((result) => {
      console.log(result);
      res.status(200).send(result);
    })
    .catch((err) => {
      console.log(err);
    });
};
