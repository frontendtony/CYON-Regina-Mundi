/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
import User from '../models/user';

export const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error', 'You need to log in first');
  return res.render('login', { source: req.path, title: 'Login' });
};

export const verifyAccountOwnership = async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
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

export const isVerified = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user.verified) {
      req.flash('error','You have to be a verified member to visit that page');
      return res.redirect('back');
    }
  } catch (error) {
    req.flash('error', 'Something went wrong, contact the system admin');
    return res.redirect('back');
  }
  return next();
};

export const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
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
