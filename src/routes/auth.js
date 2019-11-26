import express from 'express';
import passport from 'passport';
import async from 'async';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import User from '../models/user';
import states from '../models/states';

const router = express.Router();

router.get('/auth/login', (req, res) => {
  res.render('login', { title: 'Login' });
});

router.post('/auth/login', (req, res, next) => {
  passport.authenticate('local', async (err, user) => {
    if (err) { return next(err); }
    if (!user) {
      req.flash('error', 'Invalid email/password');
      return res.redirect('/auth/login');
    }
    await req.logIn(user, (error) => {
      if (error) { return next(error); }
      return req.flash('success', 'You have been successfully logged in');
    });
    return res.redirect('back');
  })(req, res, next);
});

router.get('/auth/signup', (req, res) => {
  if (req.user) {
    req.flash('error', 'You are already logged in');
    return res.redirect('back');
  }
  return res.render('register', { states });
});

router.post('/auth/signup', async (req, res) => {
  const { newUser, password, username } = req.body;
  newUser.email = username;
  newUser.username = username;
  try {
    const user = await User.register(newUser, password);
    passport.authenticate('local')(req, res, () => {
      const id = user._id;
      return res.redirect(`/members/${id}/imageupload`);
    });
  } catch (error) {
    if (error.name === 'UserExistsError') {
      req.flash('error', 'A user already exists with the same email');
    } else {
      req.flash('error', 'Something went wrong, contact the system admin');
    }
    return res.redirect('/auth/signup');
  }
});

router.get('/auth/logout', (req, res) => {
  req.logout();
  req.flash('success', 'You have been logged out');
  res.redirect('/auth/login');
});

router.get('/auth/passwordreset', (req, res) => {
  res.render('passwordReset');
});

router.post('/auth/passwordreset', (req, res, next) => {
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
          return res.redirect('/auth/passwordreset');
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
          + 'http://'}${req.headers.host}/auth/passwordreset/${token}\n\n`
          + 'If you did not request this, please ignore this email and your password will remain unchanged.\n',
      };
      smtpTransport.sendMail(mailOptions, (err) => {
        if (err) {
          req.flash('error', 'There was an error sending the password recovery email, please contact the system admin');
          return res.redirect('back');
        }
        req.flash('success', `An e-mail has been sent to ${user.email} with further instructions.`);
        done(err, 'done');
      });
    },
  ], (err) => {
    if (err) return next(err);
    return res.redirect('/auth/passwordreset');
  });
});

router.get('/auth/passwordreset/:token', async (req, res) => {
  try {
    await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    });
  } catch (error) {
    req.flash('error', 'Password reset token is invalid or has expired.');
    return res.redirect('/auth/passwordreset');
  }
  return res.render('reset', { token: req.params.token });
});

router.post('/auth/passwordreset/:token', (req, res) => {
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
          req.flash('error', 'Password reset token is invalid or has expired');
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

export default router;
