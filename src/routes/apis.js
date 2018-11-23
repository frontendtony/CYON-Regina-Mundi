import express from 'express';
import moment from 'moment';
import User from '../models/user';

const router = express.Router();

const updateById = async (id, data) => {
  try {
    await User.findByIdAndUpdate(id, data);
  } catch (error) {
    return false;
  }
  return true;
}

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

router.put('/api/confirmuser/:id', async (req, res) => {
  if (updateById(req.params.id, { verified: true })) {
    return res.status(200).json({ status: true });
  }
  return res.status(500).json({
    status: false,
    message: 'Could not update profile, contact the system admin',
  });
});

router.put('/api/setadmin/:id', async (req, res) => {
  if (updateById(req.params.id, { isAdmin: true, verified: true })) {
    return res.json({ status: true });
  }
  return res.json({
    status: false,
    message: 'Could not update profile, contact the system admin',
  });
});

export default router;
