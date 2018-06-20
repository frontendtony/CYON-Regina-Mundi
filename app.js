var express = require('express');
var app = express();
var flash = require('connect-flash');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var localStrategy = require('passport-local');
var methodOverride = require('method-override');
var User = require('./models/user');

mongoose.connect("mongodb://localhost/cyon");


app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.static("vendor"));
app.use(methodOverride("_method"));
app.use(flash());

app.get('/', function(req, res) {
    res.render('landing', {title: 'CYON Regina-Mundi'});
})

app.get('/login', function(req, res) {
    res.render('login', {title: 'Login'});
})

app.get('/register', function(req, res) {
    res.render('register', {title: 'Sign Up'});
})

app.post('/register', function(req, res) {
    var newUser = req.body.newUser;
    newUser.dateOfBirth = new Date(req.body.year + '-' + req.body.month + '-' + req.body.date);
    newUser.username = newUser.firstname + '.' + newUser.lastname;
    User.create(newUser, function(err, createdUser){
        if(err){
            console.log('Could not create user')
        } else {
            console.log(createdUser)
        }
    })
    res.redirect('/register');
})



// mongoose.connect("mongodb://localhost/cyon_v1");


app.listen(process.env.PORT || 8080, process.env.IP || '0.0.0.0', function() {
    console.log("CYON App Started")
})