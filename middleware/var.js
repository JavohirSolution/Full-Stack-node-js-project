module.exports = function (req, res, next) {
    // req.cookies.token;
    const isAuth = req.cookies.token ? true : false;
    res.locals.token = isAuth;
    next()
}