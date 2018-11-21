/* eslint no-underscore-dangle: ["error", { "allow": ["_id", "_doc"] }] */
import express from 'express';
import moment from 'moment';
import cloudinary from 'cloudinary';
import multer from 'multer';
import { isLoggedIn, verifyAccountOwnership } from '../middleware';
import User from '../models/user';
import states from '../models/states';

const router = express.Router();

const storage = multer.diskStorage({
  filename(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  },
});

const imageFilter = (req, file, cb) => {
  // accept image files only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  return cb(null, true);
};
const upload = multer({ storage, fileFilter: imageFilter });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

router.get('/members', isLoggedIn, async (req, res) => {
  const members = await User.find().exec();
  const users = await members.map((member) => {
    const newObj = member._doc;
    newObj.image = member.imageId
      ? cloudinary.url(member.imageId, {
        height: 400,
        width: 400,
        crop: 'fill',
        gravity: 'face:center',
        secure: true,
      })
      : 'https://via.placeholder.com/400?text=image_unavailable';
    return newObj;
  });
  const president = users.find(m => m.currentPosition === 'president');
  const vice = users.find(m => m.currentPosition === 'vice president');
  const queen = users.find(m => m.currentPosition === 'queen');
  const floorMembers = users.filter(m => m.isExecutive === false);
  const executives = users.filter((m) => {
    const { currentPosition, isExecutive } = m;
    return isExecutive && !currentPosition.match(/[president]$/);
  });
  return res.render('members', {
    members: floorMembers,
    president,
    queen,
    vicePresident: vice,
    executives,
  });
});

router.get('/members/birthdays', isLoggedIn, (req, res) => {
  res.render('birthdays');
});

router.get('/members/:id', isLoggedIn, async (req, res) => {
  let member;
  try {
    member = await User.findById(req.params.id);
  } catch (error) {
    return res.redirect('/members');
  }
  member.image = cloudinary.url(member.imageId, {
    height: 400,
    width: 400,
    crop: 'fill',
    gravity: 'face:center',
    secure: true,
  });
  member.birthday = moment(member.dateOfBirth).format('MMMM Do');
  return res.render('member', { member });
});

router.get('/members/:id/edit', isLoggedIn, verifyAccountOwnership,
  async (req, res) => {
    let member;
    try {
      member = await User.findById(req.params.id);
    } catch (error) {
      res.flash('error', 'Something went wrong, contact the system admin');
      return res.redirect('/members');
    }
    member.birthday = moment(member.dateOfBirth).format('YYYY-MM-DD');
    return res.render('editProfile', {
      member,
      states,
    });
  });

router.put('/members/:id/edit', isLoggedIn, verifyAccountOwnership,
  async (req, res) => {
    try {
      await User.findByIdAndUpdate(req.params.id, req.body.user);
    } catch (error) {
      res.flash('error', 'Something went wrong, contact the system admin');
      return res.redirect(`/members/${req.params.id}/edit`);
    }
    return res.redirect(`/members/${req.params.id}`);
  });

router.get('/members/:id/imageupload', isLoggedIn, (req, res) => {
  const { id } = req.params;
  return res.render('imageUpload', { userId: id });
});

router.post('/members/:id/imageupload',
  verifyAccountOwnership, upload.single('image'),
  async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
      if (user.image) {
        const { imageId } = user;
        await cloudinary.v2.uploader.destroy(imageId, { invalidate: true });
      }
      try {
        const result = await cloudinary.v2.uploader.upload(req.file.path,
          { folder: 'cyon/' });
        user.image = result.secure_url;
        user.imageId = result.public_id;
        user.save();
        req.flash('success', 'Profile picture updated successfully');
        return res.redirect(`/members/${user._id}`);
      } catch (error) {
        req.flash('error', error);
        return res.redirect(`/members/${req.params.id}/imageupload`);
      }
    } catch (error) {
      req.flash('error', error.message);
      return res.redirect('back');
    }
  });

export default router;
