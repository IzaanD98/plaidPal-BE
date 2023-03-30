const User = require("../db/model/UserModel");

exports.fetchAllUsers = () => {
  return User.find().then((results) => {
    return results;
  });
};

exports.postUser = (newUser) => {
  return User.create(newUser).then((results) => {
    return results;
  });
};
