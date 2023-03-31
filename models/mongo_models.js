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
  console.log("in addnote");
  console.log(transaction_id, googleId, note);
  // return User.updateOne({googleId}, {$set:{notes:{transaction_id, note}}})
  return User.updateOne({googleId}, {$set:{notes:{transaction_id, note}}})
  // return User.patchOne({googleId}, {notes:{transaction_id, note}})
  // return User.updateOne({googleId}, {notes:{transaction_id, note}})
  .then((results)=>{
    console.log(results);
    return results;
  })
}
