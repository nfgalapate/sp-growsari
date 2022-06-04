const mongoose = require("mongoose");
require("dotenv").config();


const {
    API_PORT,
    MONGO_URI 
} = process.env;



exports.connect = () => {
    mongoose
        .connect(MONGO_URI, {
        })
        .then(() => {
            console.log("Successfully connected to the database");
        })
        .catch((error) => {
            console.log("Database connection failed...");
            console.error(error);
            process.exit(1);
        })
}