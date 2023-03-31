const {
  postUser,
  fetchAllUsers,
  fetchUserById,
  removeUserById,
  addNote,
} = require("../models/mongo_models");
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
  postUser(newUser)
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
        res.status(200).set({}).send(link_token);
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
      res.status(401).send(err);
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

exports.getUserById = (req, res, next) => {
  const { googleId } = req.params;
  fetchUserById(googleId)
    .then((results) => {
      res.status(200).send(results);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.deleteUserById = (req, res, next) => {
  const { googleId } = req.params;
  removeUserById(googleId)
    .then(() => {
      res.status(204).send({ message: "User is Deleted" });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postNoteByTransactionId = (req, res, next) => {
  const { transaction_id } = req.params;
  const obj = req.body;
  const {googleId, note} = obj;

  addNote(transaction_id, googleId, note)
  .then((result)=> {
    res.status(201).send({ message: "Note added to DB" });
  })
  .catch((err) => {
    console.log(err);
  });
};