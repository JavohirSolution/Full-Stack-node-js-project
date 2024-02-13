const express = require('express');
const app = express();
require("dotenv").config();
app.use(express.json());
const { create } = require('express-handlebars');
const AuthRoutes = require("./routes/auth");
const ProductRoutes = require("./routes/products");
const db = require("./config/db");
const flash = require("connect-flash");
const session = require("express-session");
var cookieParser = require('cookie-parser');
const hbsHelpers = require("./utilis/index");

const varMiddleware = require("./middleware/var");
const { UserMiddleware } = require('./middleware/user');


const hbs = create({
    defaultLayout: "main",
    extname: "hbs",
    helpers: hbsHelpers
})
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', './views');
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser())
app.use(session({ secret: "Sammi", resave: false, saveUninitialized: false, }));
app.use(flash());
app.use(varMiddleware);
app.use(UserMiddleware)
app.use(AuthRoutes);
app.use(ProductRoutes);

db()
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});