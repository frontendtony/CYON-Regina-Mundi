var express = require('express');
var app = express();
var flash = require('connect-flash');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var passport = require('passport');
var LocalStrategy = require('passport-local');
var methodOverride = require('method-override');
var User = require('./models/user');
var seedDb = require('./models/seed');
var indexRoute = require('./routes/index');
var userRoute = require('./routes/user');

mongoose.connect("mongodb://localhost/cyon_test");

// seedDb();

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.static("vendor"));
app.use(methodOverride("_method"));
app.use(flash());


//PASSPORT CONFIGURATION
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({mongooseConnection: mongoose.connection})
}));

// app.use(express.session({
//     secret: 'a4f8071f-c873-4447-8ee2',
//     cookie: { maxAge: 2628000000 },
//     store: new (require('express-sessions'))({
//         storage: 'mongodb',
//         collection: 'sessions', // optional
//         expire: 86400 // optional
//     })
// }));

app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
})


app.use(indexRoute);
app.use(userRoute);


app.listen(process.env.PORT || 8080, process.env.IP || '0.0.0.0', function() {
    console.log("CYON App Started")
})