const mongoose = require("mongoose");
require("dotenv").config();

const DBconnect = () => {
    mongoose.connect(process.env.DATABASE_URL)
        .then(() => console.log("DB connected successfully"))
        .catch((err) => {
            console.error("Error connecting to DB:", err);
            process.exit(1); // Exit if connection fails
        });
};

module.exports = DBconnect;
