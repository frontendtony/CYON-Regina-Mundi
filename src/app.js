import express from 'express';
import path from 'path';
import flash from 'connect-flash';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import session from 'express-session';
import ConnectMongo from 'connect-mongo';
import passport from 'passport';
import methodOverride from 'method-override';
import User from './models/user';
import indexRoute from './routes/index';
import userRoute from './routes/user';
import apiRoute from './routes/apis';
import committeesRoute from './routes/committee';
import authRoute from './routes/auth';

const MongoStore = ConnectMongo(session);
const app = express();

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
app.use(authRoute);

app.listen(process.env.PORT || 8080, process.env.IP || '0.0.0.0', () => {
  console.log("CYON App Started")
})