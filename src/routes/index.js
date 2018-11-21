import express from 'express';
import User from '../models/user';
import { isLoggedIn, isAdmin } from '../middleware';

const router = express.Router();

router.get('/', isLoggedIn, (req, res) => {
  res.render('landing', { title: 'CYON Regina-Mundi' });
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

export default router;
