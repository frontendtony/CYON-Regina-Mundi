const express = require('express');
const path = require('path');
const app = express();
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');
const methodOverride = require('method-override');
const User = require('./models/user');
const indexRoute = require('./routes/index');
const userRoute = require('./routes/user');
const apiRoute = require('./routes/apis');
const committeesRoute = require('./routes/committee');
require('dotenv').config();

mongoose.connect(process.env.CYONDB);

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set('views', path.normalize(__dirname + '/views'));
app.use(express.static(path.normalize(__dirname + '/public')));
app.use(methodOverride("_method"));
app.use(flash());

//PASSPORT CONFIGURATION
app.use(session({
    secret: process.env.PASSPORT_SECRET,
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({mongooseConnection: mongoose.connection})
}));

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
app.use(apiRoute);
app.use(committeesRoute);

app.listen(process.env.PORT || 8080, process.env.IP || '0.0.0.0', function() {
    console.log("CYON App Started")
})