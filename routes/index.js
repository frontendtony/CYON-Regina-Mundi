const express = require('express');
const router = express.Router();
const middleware = require('../middleware');
const passport = require('passport');

router.get('/', middleware.isLoggedIn, (req, res) => {
    res.render('landing', {title: 'CYON Regina-Mundi'});
});


router.get('/login', (req, res) => {
    res.render('login', {title: 'Login'});
});


router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) { return next(err); }
        if (!user) { req.flash('error', 'Invalid email/password'); return res.redirect('/login'); }
        req.logIn(user, function(err) {
            if (err) { return next(err); }
            req.flash('success', 'You have been successfully logged in');
            return res.redirect('/');
        });
    })(req, res, next);
});


router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'You have been logged out');
    res.redirect('/login');
})


router.get('/userControl', (req, res) => {
    res.render('userControl');
})


router.get('/birthdays', middleware.isLoggedIn, (req, res) => {
    res.render('birthdays');
})


module.exports = router;