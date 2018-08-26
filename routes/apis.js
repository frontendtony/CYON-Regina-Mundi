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


router.get('/apis/updatePosition/:id/:position', (req, res) => {
    User.findOneAndUpdate({currentPosition: req.params.position}, {isExecutive: false, currentPosition: 'member'}, (err, exec) => {
        if(err) return res.send('Could not fetch data, please try again later.');
    });
    
    User.findByIdAndUpdate(req.params.id, {currentPosition: req.params.position, isExecutive: true}, (err, executive) => {
        if(err) return res.json({'status': false, 'message': 'Could not fetch data, please try again later.'});
        res.json({'status': true});
    });
});


module.exports = router;