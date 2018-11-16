const express = require('express');
const router = express.Router();
const middleware = require('../middleware');
const User = require('../models/user');

router.get('/committees', (req, res) => {
  res.render('committees', {title: 'CYON | Committees'});
});

router.get('/committees/new', (req, res) => {
  res.render('newCommittee', {title: 'CYON | Add new committee'});
});

module.exports = router;
