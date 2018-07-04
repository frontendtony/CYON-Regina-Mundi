var express = require('express');
var router = express.Router();
var User = require('../models/user');
var passport = require('passport');
var moment = require('moment');
var middleware = require('../middleware');
var cloudinary = require('cloudinary');
var multer = require('multer');
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})



cloudinary.config({ 
  cloud_name: 'tonerolima', 
  api_key: '495368473539414', 
  api_secret: 'UrVOleILaWLRAM_yFAHdGp0S-uc'
});


router.get('/register', function(req, res) {
    res.render('register', { title: 'Sign Up' });
});


router.post('/register', function(req, res) {
    var newUser = req.body.newUser;
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


router.get('/members', /*middleware.isLoggedIn,*/ function(req, res){
    User.find(function(err, members){
        if(err){
            console.log(err);
            return res.redirect('/')
        }
        res.render('members', { members: members });
    })
})


router.get('/members/:id', function(req, res) {
    User.findById(req.params.id, function (err, member){
        if(err){
            console.log(err);
            return res.redirect('/members')
        }
        member.birthday = moment(member.dateOfBirth).format("MMMM Do");
        res.render('member', {member: member});
    })
})


router.get('/uploadImage/:id', function(req, res) {
    res.render('imageUpload', {userId: req.params.id});
})


router.post("/uploadImage/:id", middleware.verifyAccountOwnership, upload.single('image'), function(req, res) {
    User.findById(req.user._id, async function(err, user){
        if(err){
            req.flash('error', err.message);
            return res.redirect('back');
        }
        console.log(user);
        var result = await cloudinary.v2.uploader.upload(req.file.path, {folder: "cyon/", public_id: user.firstname+"_"+user.lastname, overwrite: true});
        user.image = result.secure_url;
        user.imageId = result.public_id;
        user.save();
        console.log(user);
        res.redirect('/members/' + user._id);
    })
})


module.exports = router;