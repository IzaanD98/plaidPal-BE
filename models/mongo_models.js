const User = require("../db/model/UserModel");


exports.fetchAllUsers = () => {
  // return User.find({NON_EXISTANT_KEY}).then((results) => { //error handling test
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
  // return User.find({ rubbish:rubbish }).then((results) => { //error testing
    return results;
  });
};

exports.removeUserById = (googleId) => {
  return User.deleteOne({ googleId }).then((results) => {
    // return results;
  });
};


exports.addNote = (transaction_id, googleId, note) => {
  // return User.updateOne({googleId:"rubbish"}, {$push:{notes:{transaction_id, note}}}) //error testing
  return User.updateOne({googleId}, {$push:{notes:{transaction_id, note}}})
  .then((results)=>{
    return results;
  })
};

exports.delAccountById = (account_id, googleId) => {

  return User.find({ googleId })
  .then((user) => {
    let accountsArray = user[0].account_ids.filter(acc => acc !== account_id);
    return User.updateOne({googleId}, {account_ids:accountsArray})
    .then((res) => {
      return res;
    })
  })
  .catch((err) => {
    return(err);
  })
}

// NONE OF THESE WORK DESPITE WHAT IT SAYS IN DOCS
// return User.updateOne({"googleId":googleId}, {$pull:{"accounts_ids": {$in:[account_id]}}})
  // return User.updateOne({googleId}, {$pull:{"accounts_ids":account_id}})
  // return User.update(
    // { "googleId":googleId}, 
  //   { $pull: {"accounts_ids":account_id}})
    // { $pull: { account_ids:{$in:[account_id]}}})
  // .then((results) => {
  //   console.log('we have some results:');
  //   console.log(results);
  //   return results;
  // })
  