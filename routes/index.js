var express = require('express');
var router = express.Router();
var middleware = require('../middleware');
var passport = require('passport');

router.get('/', middleware.isLoggedIn, function(req, res) {
    res.render('landing', {title: 'CYON Regina-Mundi'});
});


router.get('/login', function(req, res) {
    res.render('login', {title: 'Login'});
});


router.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) { return next(err); }
        if (!user) { req.flash('error', 'Invalid email/password'); return res.redirect('/login'); }
        req.logIn(user, function(err) {
            if (err) { return next(err); }
            req.flash('success', 'You have been successfully logged in');
            return res.redirect('/');
        });
    })(req, res, next);
});


router.get('/logout', function(req, res) {
    req.logout();
    req.flash('success', 'You have been logged out');
    res.redirect('/login');
})

module.exports = router;