var express = require('express');
var router = express.Router();
var User = require('../models/user');
var passport = require('passport');
var moment = require('moment');
var middleware = require('../middleware');


router.get('/register', function(req, res) {
    res.render('register', { title: 'Sign Up' });
});

router.post('/register', function(req, res) {
    var newUser = req.body.newUser;
    newUser.dateOfBirth = new Date(req.body.year + '-' + req.body.month + '-' + req.body.date);
    newUser.email = req.body.username;
    newUser.username = req.body.username;
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            if (err.name === 'UserExistsError') {
                req.flash('error', 'A user already exists with the same email');
            }
            return res.render('register', { title: 'Sign Up', newUser: newUser });
        }
        passport.authenticate('local')(req, res, function() {
            res.redirect('/');
        });
    });
})

router.get('/members', /*middleware.isLoggedIn,*/ function(req, res){
    User.find(function(err, members){
        if(err){
            console.log(err);
            return res.redirect('/')
        }
        res.render('members', { members: members });
    })
})

router.get('/member/:id', function(req, res) {
    User.findById(req.params.id, function (err, member){
        if(err){
            console.log(err);
            return res.redirect('/members')
        }
        member.birthday = moment(member.dateOfBirth).format("MMMM Do");
        res.render('member', {member: member});
    })
})

module.exports = router;