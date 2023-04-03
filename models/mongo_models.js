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

exports.fetchUserById = (googleId) => {
  return User.find({ googleId }).then((results) => {
    return results;
  });
};

exports.removeUserById = (googleId) => {
  return User.deleteOne({ googleId }).then((results) => {
    return results;
  });
};


exports.addNote = (transaction_id, googleId, note) => {
  return User.updateOne({googleId}, {$push:{notes:{transaction_id, note}}})
  .then((results)=>{
    return results;
  })
}
