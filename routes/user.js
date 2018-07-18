const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const moment = require('moment');
const middleware = require('../middleware');
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
  cloud_name: 'tonerolima', 
  api_key: '495368473539414', 
  api_secret: 'UrVOleILaWLRAM_yFAHdGp0S-uc'
});


router.get('/register', function(req, res) {
    res.render('register', { title: 'Sign Up' });
});


router.post('/register', function(req, res) {
    let newUser = req.body.newUser;
    newUser.dateOfBirth = new Date(req.body.year + '-' + req.body.month + '-' + req.body.date);
    newUser.email = req.body.username;
    newUser.username = req.body.username;
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            if (err.name === 'UserExistsError') {
                req.flash('error', 'A user already exists with the same email');
            }
            return res.render('register', { title: 'Sign Up', newUser: newUser });
        }
        passport.authenticate('local')(req, res, function() {
            res.redirect('/uploadImage/'+user._id);
        });
    });
})


router.get('/members', middleware.isLoggedIn, function(req, res){
    User.find(function(err, members){
        if(err){
            console.log(err);
            return res.redirect('/')
        }
        members.map(member => {
            let newObj = member;
            newObj.image = member.imageId? cloudinary.url(member.imageId, {height: 400, width: 400, crop: "fill", gravity: "face:center", secure: true}): member.image;
            return newObj;
        })
        res.render('members', { members: members });
    })
})


router.get('/members/:id', middleware.isLoggedIn, function(req, res) {
    User.findById(req.params.id, function (err, member){
        if(err){
            console.log(err);
            return res.redirect('/members');
        }
        member.image = cloudinary.url(member.imageId, {height: 400, width: 400, crop: "fill", gravity: "face:center", secure: true});
        member.birthday = moment(member.dateOfBirth).format("MMMM Do");
        res.render('member', {member: member});
    })
})


router.get('/uploadImage/:id', middleware.isLoggedIn, function(req, res) {
    res.render('imageUpload', {userId: req.params.id});
})


router.post("/uploadImage/:id", middleware.verifyAccountOwnership, upload.single('image'), function(req, res) {
    User.findById(req.user._id, async function(err, user){
        if(err){
            req.flash('error', err.message);
            return res.redirect('back');
        }
        let result = await cloudinary.v2.uploader.upload(req.file.path, {folder: "cyon/", public_id: user.firstname+"_"+user.lastname, overwrite: true});
        user.image = result.secure_url;
        user.imageId = result.public_id;
        user.save();
        res.redirect('/members/' + user._id);
    })
})


module.exports = router;