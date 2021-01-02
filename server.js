const express = require("express");
const mongoose = require("mongoose");
var exphbs = require("express-handlebars");
const multer = require('multer');
const bodyParser = require('body-parser');
const Handlebars = require('handlebars');
const HandlebarsIntl= require('handlebars-intl');
var methodOverride = require('method-override');
var session = require('express-session');
var flash = require('connect-flash');
const bcrypt=require('bcryptjs');
var passport =require('passport')

//create express application with help of express function();
const app = express();

//load profile block
const profile= require('./Routes/profile')
//load auth block here

const users=require('./Routes/auth');
  
//loading passport module here
require('./config/passport')(passport);


HandlebarsIntl.registerWith(Handlebars);
// override with POST having ?_method=DELETE
app.use(methodOverride('_method'))

Handlebars.registerHelper("trimString", function(passedString) {
  var theString = [...passedString].splice(6).join("");
  return new Handlebars.SafeString(theString);
});

//connecting mongodb database
const mongodbUrl="mongodb+srv://profileapp:12345@cluster0-yfyam.mongodb.net/test?retryWrites=true&w=majority";

mongoose.connect(
  mongodbUrl,
  { useUnifiedTopology: true, useNewUrlParser: true },
  err => {
    if (err) throw err;
    console.log("mongodb is connected");
  }
);

//session middleware
app.use(
  session({
  secret:"keyboard cat",
  resave: false,
  saveUninitialized:true,
})
);

//connect flash middleware here
app.use(passport.initialize());
app.use(passport.session());




//connect flash middle ware here
app.use(flash());
//create global middleware
app.use(function(req,res,next){
  res.locals.success_msg=req.flash('success_msg');
  res.locals.error_msg=req.flash('error_msg');
  res.locals.error=req.flash('error');
  res.locals.users=req.user || null;
  next()
})
//set template engine middleware
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

//serving static files...
app.use(express.static(__dirname + "/public"));



//bodyparser middleware here
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//ending body parser middleware 

//basic route
app.get("/", (req, res) => {
  res.render("home.handlebars");
});

app.use("/profile",profile);
//user middleware here
app.use('/user',users);



//at last page not found route
app.get("**", (req, res) => {
  res.render("404.handlebars");
});
//create port and server
const port = process.env.PORT || 5000;
app.listen(port, err => {
  if (err) throw err;
  console.log(`App listening on port ${port}!`);
});
