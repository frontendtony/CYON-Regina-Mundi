var express = require('express');
var router = express.Router();
var User = require('../models/user');
var passport = require('passport');


router.get('/login', function(req, res) {
    res.render('login', {title: 'Login'});
});

router.get('/register', function(req, res) {
    res.render('register', {title: 'Sign Up'});
});

router.post('/register', function(req, res) {
    var newUser = req.body.newUser;
    newUser.dateOfBirth = new Date(req.body.year + '-' + req.body.month + '-' + req.body.date);
    newUser.email = req.body.email;
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render('register', {title: 'Sign Up'});
        }
        console.log(user);
        passport.authenticate('local')(req, res, function(){
            console.log('Authenticating....');
            res.render('landing', {title: 'CYON Regina-Mundi'});
        });
    });
})

module.exports = router;