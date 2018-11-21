/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
const User = require('../models/user');

const middlewareObject = {};

middlewareObject.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error', 'You need to log in first');
  return res.render('login', { source: req.path, title: 'Login' });
};

middlewareObject.verifyAccountOwnership = async (req, res, next) => {
  const { id } = req.params;
  let user;
  try {
    user = await User.findById(id);
    if (!(user._id.equals(req.user._id))) {
      req.flash('error', 'Access Denied!');
      return res.redirect(`/members/${id}`);
    }
  } catch (error) {
    req.flash('error', 'Something went wrong, contact the system admin');
    return res.redirect('back');
  }
  return next();
};


middlewareObject.isAdmin = async (req, res, next) => {
  let user;
  try {
    user = await User.findById(req.user._id);
    if (!user.isAdmin) {
      req.flash('error', 'Access Denied!');
      return res.redirect('/');
    }
  } catch (error) {
    req.flash('error', 'Something went wrong, contact the system admin');
    return res.redirect('back');
  }
  return next();
};


module.exports = middlewareObject;
