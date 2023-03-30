const mongoose = require("mongoose");

const connectDB = () => {
  mongoose
    .connect(
      `mongodb+srv://mikegreenan98:plaidPal@cluster1.qfpekly.mongodb.net/test`,
      { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(() => {
      console.log("connected to MongoDB");
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = connectDB;
