const mongoose = require("mongoose");
require("dotenv").config();

const DBconnect = () => {
    mongoose.connect(process.env.DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // tls: true,
        // tlsAllowInvalidCertificates: true, // Only for development; remove this for production
      })
      .then(() => console.log('Db connected'))
      .catch(err => console.log('Error connecting to DB:', err));
};

module.exports = DBconnect;
