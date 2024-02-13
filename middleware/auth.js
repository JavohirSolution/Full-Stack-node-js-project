module.exports.AuthMiddleware = function (req, res, next) {
    if (!req.cookies.token) {
        res.redirect("/login");
        return;
    }
    next();
}