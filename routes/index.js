const express = require('express');
const router = express.Router();
const middleware = require('../middleware');
const passport = require('passport');
const User = require('../models/user');
const async = require('async');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
require('dotenv').config();


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
        req.logIn(user, (err) => {
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


router.get('/passwordReset', (req, res) => {
    res.render('passwordReset');
})


router.post('/passwordReset', (req, res, next) => {
  async.waterfall([
    (done) => {
      crypto.randomBytes(20, (err, buf) => {
        let token = buf.toString('hex');
        done(err, token);
      });
    },
    (token, done) => {
      User.findOne({ email: req.body.email }, (err, user) => {
        if (!user) {
          req.flash('error', 'No account exists with that email address.');
          return res.redirect('/passwordReset');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save((err) => {
          done(err, token, user);
        });
      });
    },
    (token, user, done) => {
      let smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: 'tonero91@gmail.com',
          pass: process.env.GMAILPW
        }
      });
      let mailOptions = {
        to: user.email,
        from: 'tonero91@gmail.com',
        subject: 'CYON Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, (err) => {
        req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        done(err, 'done');
      });
    }
  ], (err) => {
    if (err) return next(err);
    res.redirect('/passwordReset');
  });
});

router.get('/reset/:token', (req, res) => {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, (err, user) => {
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/passwordReset');
    }
    res.render('reset', {token: req.params.token});
  });
});

router.post('/reset/:token', (req, res) => {
  async.waterfall([
    (done) => {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, (err, user) => {
        if (!user) {
          req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('back');
        }
        if(req.body.password === req.body.confirmPassword) {
          user.setPassword(req.body.password, (err) => {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            user.save((err) => {
              req.logIn(user, (err) => {
                done(err, user);
              });
            });
          })
        } else {
            req.flash("error", "Passwords do not match.");
            return res.redirect('back');
        }
      });
    },
    (user, done) => {
      let smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: 'tonero91@gmail.com',
          pass: process.env.GMAILPW
        }
      });
      let mailOptions = {
        to: user.email,
        from: 'tonero91@mail.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, (err) => {
        req.flash('success', 'Success! Your password has been changed.');
        done(err);
      });
    }
  ], (err) => {
    res.redirect('/');
  });
});


router.get('/userControl', (req, res) => {
    User.find({}, 'firstname lastname currentPosition' ,(err, users) => {
      if(err){
        req.flash('error', "Sever error, please contact the admin")
        return res.redirect('/');
      }
      res.render('userControl', {members: users});
    })
})


router.get('/birthdays', middleware.isLoggedIn, (req, res) => {
    res.render('birthdays');
})


module.exports = router;