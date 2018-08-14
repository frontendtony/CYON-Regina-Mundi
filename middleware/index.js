const User = require("../models/user")
const middlewareObject = {};

middlewareObject.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.render('login', { source: req.path, title: 'Login' });
    }
}

middlewareObject.verifyAccountOwnership = function(req, res, next) {
    User.findById(req.params.id, function(err, user) {
        if (err) {
            res.redirect('back');
        } else {
            //check if user owns the campground
            if (user._id.equals(req.user._id)) {
                next();
            } else {
                req.flash('error', 'Access Denied!');
                return res.redirect('/members/' + req.params.id);
            }
        }
    })
};

module.exports = middlewareObject;