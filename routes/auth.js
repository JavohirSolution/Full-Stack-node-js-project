const router = require("express").Router();
const { User } = require("../models/User");
const bcrypt = require("bcrypt");
const { generateJSONTOKEN } = require("../services/token");

router.get("/login", async (req, res) => {
    if (req.cookies.token) {
        res.redirect("/");
        return;
    }
    res.render('login', {
        title: "Login ",
        isLogin: true,
        LoginError: req.flash("LoginError")
    })
})
router.get("/register", async (req, res) => {
    if (req.cookies.token) {
        res.redirect("/");
        return;
    }
    res.render('register', {
        title: "Register ",
        isRegister: true,
        RegisterError: req.flash("RegisterError")

    })
})
router.get("/logout", (req, res) => {
    res.clearCookie("token")
    res.redirect("/login")
})
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            req.flash("LoginError", "All fields is required");
            res.redirect("/login");
            return
        }
        const userExist = await User.findOne({ email })
        if (!userExist) {
            req.flash("LoginError", "User not found");
            res.redirect("/login");
            return
        }
        const isEqual = await bcrypt.compare(password, userExist.password)
        if (!isEqual) {
            req.flash("LoginError", "Password or Email is wrong");
            res.redirect("/login");
            return
        }
        const token = generateJSONTOKEN(userExist._id)
        res.cookie("token", token, { httpOnly: true, secure: true })
        res.redirect("/")
    } catch (error) {
        res.status(500).send({
            message: error.message,
            data: error,
            success: false
        })
    }
})
router.post("/register", async (req, res) => {
    try {
        const { firstname, lastname, email, password } = req.body
        if (!firstname || !lastname || !email || !password) {
            req.flash("RegisterError", "All fields is required");
            res.redirect("/register");
            return
        }

        const candidate = await User.findOne({ email });
        if (candidate) {
            req.flash("RegisterError", "User already exist");
            res.redirect("/register");
            return
        }
        const userData = new User({
            firstname: firstname,
            lastname: lastname,
            email: email,
            password: await bcrypt.hash(password, 15)
        });
        const user = await userData.save();
        const token = generateJSONTOKEN(user._id)
        res.cookie("token", token, { httpOnly: true, secure: true })
        res.redirect("/")
    } catch (error) {
        res.send({
            message: error.message,
            data: error,
            success: false
        })
    }
})
module.exports = router