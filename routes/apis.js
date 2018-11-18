const express = require('express');
const moment = require('moment');
const User = require('../models/user');

const router = express.Router();


router.get('/apis/birthdays/:month', async (req, res) => {
  try {
    const members = await User.find(
      {}, 'firstname lastname gender dateOfBirth email phone',
    );
    const result = members.filter((member) => {
      const month = moment(member.dateOfBirth).month();
      return month === Number(req.params.month);
    });
    return res.json(result);
  } catch (error) {
    return res.send('Could not fetch data, please try again later');
  }
});


router.get('/apis/updatePosition/:id/:position', async (req, res) => {
  try {
    const { id } = req.params;
    const currentPosition = req.params.position;
    const updateObject = { isExecutive: false, currentPosition: 'member' };
    await User.findOneAndUpdate({ currentPosition }, { updateObject });
    await User.findByIdAndUpdate(id, { currentPosition, isExecutive: true });
    return res.json({ status: true });
  } catch (error) {
    return res.json({
      status: false,
      message: 'Could not fetch data, please try again later',
    });
  }
});

module.exports = router;
