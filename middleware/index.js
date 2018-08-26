const User = require("../models/user")
const middlewareObject = {};

middlewareObject.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash('error', 'You need to log in first');
        res.render('login', { source: req.path, title: 'Login' });
    }
}

middlewareObject.verifyAccountOwnership = function(req, res, next) {
    User.findById(req.params.id, function(err, user) {
        if (err) {
            req.flash('error', 'Something went wrong! Please contact the system administrator');
            return res.redirect('back');
        } else {
            if (user._id.equals(req.user._id)) {
                next();
            } else {
                req.flash('error', 'Access Denied!');
                return res.redirect('/members/' + req.params.id);
            }
        }
    })
};


middlewareObject.isAdmin = function(req, res, next) {
    User.findById(req.user._id, function(err, user) {
        if (err) {
            req.flash('error', 'Something went wrong! Please contact the system administrator');
            return res.redirect('/');
        } else {
            if (user.isAdmin) {
                next();
            } else {
                req.flash('error', 'Access Denied!');
                return res.redirect('/');
            }
        }
    })
};



module.exports = middlewareObject;