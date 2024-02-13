const mongoose = require('mongoose');
require("dotenv").config();

const MONGO_URL = process.env.MONGO_URL

const db = async () => {
    try {
        const connect = await mongoose.connect(MONGO_URL)
        console.log("Database is running");
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = db