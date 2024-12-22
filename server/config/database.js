// IMPORTS -
const mongoose = require("mongoose");

// FUNCTION TO CONNECT DATABASE
const connectDatabase = () => {
  mongoose
    .connect(process.env.DB_URL)
    .then((data) => {
      console.log(`MongoDB connected with server: ${data.connection.host}`);
    });
};

module.exports = connectDatabase;
 