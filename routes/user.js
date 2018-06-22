var express = require('express');
var router = express.Router();
var User = require('../models/user');
var passport = require('passport');


router.get('/register', function(req, res) {
    res.render('register', {title: 'Sign Up'});
});

router.post('/register', function(req, res) {
    var newUser = req.body.newUser;
    newUser.dateOfBirth = new Date(req.body.year + '-' + req.body.month + '-' + req.body.date);
    newUser.email = req.body.username;
    newUser.username = req.body.username;
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            if(err.name === 'UserExistsError'){
                req.flash('error', 'A user already exists with the same email');
            }
            return res.render('register', {title: 'Sign Up', newUser: newUser});
        }
        console.log(user);
        passport.authenticate('local')(req, res, function(){
            console.log('Authenticating....');
            res.redirect('/');
        });
    });
})

module.exports = router;