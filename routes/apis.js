const express = require('express');
const router = express.Router();
// const middleware = require('../middleware');
const User = require('../models/user');
const moment = require('moment');


router.get('/apis/birthdays/:month', (req, res) => {
    User.find( {}, 'firstname lastname gender dateOfBirth email phone', (err, members) => {
        if(err) return res.send('Could not fetch data, please try again later.');
        let results = members.filter(member => moment(member.dateOfBirth).month() == req.params.month );
        res.json(results);
    });
});


module.exports = router;