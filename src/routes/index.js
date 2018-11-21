const express = require('express');
const passport = require('passport');
const async = require('async');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const User = require('../models/user');
const { isLoggedIn, isAdmin } = require('../middleware');

const router = express.Router();

router.get('/', isLoggedIn, (req, res) => {
  res.render('landing', { title: 'CYON Regina-Mundi' });
});


router.get('/login', (req, res) => {
  res.render('login', { title: 'Login' });
});


router.post('/login', (req, res, next) => {
  passport.authenticate('local', async (err, user) => {
    if (err) { return next(err); }
    if (!user) {
      req.flash('error', 'Invalid email/password');
      return res.redirect('/login');
    }
    await req.logIn(user, (error) => {
      if (error) { return next(error); }
      return req.flash('success', 'You have been successfully logged in');
    });
    return res.redirect('/');
  })(req, res, next);
});


router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success', 'You have been logged out');
  res.redirect('/login');
});


router.get('/passwordReset', (req, res) => {
  res.render('passwordReset');
});


router.post('/passwordReset', (req, res, next) => {
  async.waterfall([
    (done) => {
      crypto.randomBytes(20, (err, buf) => {
        const token = buf.toString('hex');
        done(err, token);
      });
    },
    (token, done) => {
      User.findOneAndUpdate({
        email: req.body.email,
      }, {
        resetPasswordToken: token,
        resetPasswordExpires: Date.now() + 3600000,
      }, async (err, user) => {
        if (err) {
          req.flash('error', 'No account exists with that email address.');
          return res.redirect('/passwordReset');
        }
        return done(err, token, user);
      });
    },
    (token, user, done) => {
      const smtpTransport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'cyonreginamundi@gmail.com',
          pass: process.env.GMAILPW,
        },
      });
      const mailOptions = {
        to: user.email,
        from: 'cyonreginamundi@gmail.com',
        subject: 'CYON Password Reset',
        text: `${'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n'
          + 'Please click on the following link, or paste this into your browser to complete the process:\n\n'
          + 'http://'}${req.headers.host}/reset/${token}\n\n`
          + 'If you did not request this, please ignore this email and your password will remain unchanged.\n',
      };
      smtpTransport.sendMail(mailOptions, (err) => {
        req.flash('success', `An e-mail has been sent to ${user.email} with further instructions.`);
        done(err, 'done');
      });
    },
  ], (err) => {
    if (err) return next(err);
    return res.redirect('/passwordReset');
  });
});

router.get('/reset/:token', async (req, res) => {
  try {
    await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    });
  } catch (error) {
    req.flash('error', 'Password reset token is invalid or has expired.');
    return res.redirect('/passwordReset');
  }
  return res.render('reset', { token: req.params.token });
});

router.post('/reset/:token', (req, res) => {
  async.waterfall([
    (done) => {
      User.findOneAndUpdate({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { $gt: Date.now() },
      }, {
        resetPasswordToken: undefined,
        resetPasswordExpires: undefined,
      }, async (err, user) => {
        if (err) {
          req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('back');
        }
        const { password, confirmPassword } = req.body;
        if (password !== confirmPassword) {
          req.flash('error', 'Passwords do not match.');
          return res.redirect('back');
        }
        await user.setPassword(req.body.password);
        await user.save();
        return req.logIn(user, (error) => {
          done(error, user);
        });
      });
    },
    (user, done) => {
      const smtpTransport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'cyonreginamundi@gmail.com',
          pass: process.env.GMAILPW,
        },
      });
      const mailOptions = {
        to: user.email,
        from: 'cyonreginamundi@mail.com',
        subject: 'Your password has been changed',
        text: `${'Hello,\n\n'
          + 'This is a confirmation that the password for your account '}
          ${user.email} has just been changed.\n`,
      };
      smtpTransport.sendMail(mailOptions, (err) => {
        req.flash('success', 'Success! Your password has been changed.');
        done(err);
      });
    },
  ], () => {
    res.redirect('/');
  });
});


router.get('/userControl', isLoggedIn, isAdmin, (req, res) => {
  const positions = [ 'President', 'Vice President', 'Secretary',
    'Assistant Secretary', 'Financial Secretary', 'PR0 1', 'PR0 2', 'DOS 1',
    'DOS 2', 'Welfare 1', 'Welfare 2', 'Provost 1', 'Provost 2', 'Queen']
  User.find({}, 'firstname lastname currentPosition', (err, users) => {
    if (err) {
      req.flash('error', 'Sever error, please contact the admin');
      return res.redirect('/');
    }
    return res.render('userControl', {
      members: users,
      positions,
    });
  });
});


router.get('/birthdays', isLoggedIn, (req, res) => {
  res.render('birthdays');
});


module.exports = router;
