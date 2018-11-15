const express = require('express');
const router = express.Router();
const middleware = require('../middleware');
const User = require('../models/user');

router.get('/committees', middleware.isLoggedIn, (req, res) => {
  res.render('committees', {title: 'CYON | Committees'});
});

module.exports = router;
