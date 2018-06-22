var middlewareObject = {};

middlewareObject.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.render('login', { source: req.path, title: 'Login' });
    }
}

module.exports = middlewareObject;