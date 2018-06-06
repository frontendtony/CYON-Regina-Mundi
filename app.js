let express = require('express');
let app = express();
let flash = require('connect-flash');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
let passport = require('passport');
let localStrategy = require('passport-local');
let methodOverride = require('method-override');


app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.static("vendor"));
app.use(methodOverride("_method"));
app.use(flash());

app.get('/', function(req, res) {
    res.render('landing');
})

// mongoose.connect("mongodb://localhost/cyon_v1");


app.listen(8080, function() {
    console.log("CYON App Started")
})