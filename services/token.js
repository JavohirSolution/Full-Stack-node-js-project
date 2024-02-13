const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateJSONTOKEN = userId => {
    const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

    return accessToken;
}

module.exports = { generateJSONTOKEN };