const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const moment = require('moment');
const middleware = require('../middleware');
require('dotenv').config();
const cloudinary = require('cloudinary');
const multer = require('multer');
const storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});

const imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
const upload = multer({ storage: storage, fileFilter: imageFilter})


cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});


router.get('/register', (req, res) => {
    if(req.user){
        req.flash('error', 'You are already logged in');
        return res.redirect('/');
    }
    res.render('register');
});


router.post('/register', (req, res) => {
    let newUser = req.body.newUser;
    newUser.email = req.body.username;
    newUser.username = req.body.username;
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            if (err.name === 'UserExistsError') {
                req.flash('error', 'A user already exists with the same email');
            }
            return res.render('register', { title: 'Sign Up', newUser: newUser });
        }
        passport.authenticate('local')(req, res, () => {
            res.redirect('/uploadImage/'+user._id);
        });
    });
})


router.get('/members', middleware.isLoggedIn, (req, res) =>{
    User.find((err, members) => {
        if(err){
            return res.redirect('/')
        }
        members.map(member => {
            let newObj = member;
            newObj.image = member.imageId? cloudinary.url(member.imageId, {height: 400, width: 400, crop: "fill", gravity: "face:center", secure: true}): "https://via.placeholder.com/400?text=image unavailable";
            return newObj;
        })
        let president = members.filter(member => member.currentPosition === 'president')[0];
        let vicePresident = members.filter(member => member.currentPosition === 'vice president')[0];
        let queen = members.filter(member => member.currentPosition === 'queen')[0];
        let floorMembers =  members.filter(member => member.isExecutive === false);
        let executives =  members.filter(member => member.isExecutive === true && !member.currentPosition.match(/[president]$/));
        res.render('members', { members: floorMembers, president: president, queen: queen, vicePresident: vicePresident, executives: executives });
    })
})


router.get('/members/:id', middleware.isLoggedIn, (req, res) => {
    User.findById(req.params.id, (err, member) => {
        if(err){
            return res.redirect('/members');
        }
        member.image = cloudinary.url(member.imageId, {height: 400, width: 400, crop: "fill", gravity: "face:center", secure: true});
        member.birthday = moment(member.dateOfBirth).format("MMMM Do");
        res.render('member', {member: member});
    })
})


router.get('/members/:id/edit', middleware.isLoggedIn, middleware.verifyAccountOwnership, (req, res) => {
    User.findById(req.params.id, (err, member) => {
        if(err) return res.redirect('/members');
        member.birthday = moment(member.dateOfBirth).format("YYYY-MM-DD");
        res.render('editProfile', {member: member});
    })
})


router.put('/members/:id/edit', middleware.isLoggedIn, middleware.verifyAccountOwnership, (req, res) => {
    User.findByIdAndUpdate(req.params.id, req.body.user, (err, user) => {
        if(err) return res.redirect(`/members/${req.params.id}/edit`);
        res.redirect(`/members/${req.params.id}`);
    })
})


router.get('/uploadImage/:id', middleware.isLoggedIn, (req, res) => {
    res.render('imageUpload', {userId: req.params.id});
})


router.post("/uploadImage/:id", middleware.verifyAccountOwnership, upload.single('image'), (req, res) => {
    User.findById(req.user._id, async (err, user) =>{
        if(err){
            req.flash('error', err.message);
            return res.redirect('back');
        }
        if(user.image) await cloudinary.v2.uploader.destroy(user.imageId, {invalidate: true});
        let result = await cloudinary.v2.uploader.upload(req.file.path, {folder: "cyon/"}, (error, result) => {
            if(error){
                req.flase('error', error) 
                return res.redirect(`/uploadImage/${req.params.id}`)
            }
        });
        user.image = result.secure_url;
        user.imageId = result.public_id;
        user.save();
        res.redirect('/members/' + user._id);
    })
})


module.exports = router;