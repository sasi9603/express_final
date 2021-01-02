const express= require('express');
const mongoose= require('mongoose');
const multer= require('multer');

const router = express.Router();//router object

const {ensureAuthenticated} = require ("../helper/auth");

// load profile schema model
require('../Model/Profile');
const Profile = mongoose.model('profile');



//multer middleware is use for uploading files includes images , pdf , word , file
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname)
    }
});
const upload = multer({ storage: storage });
//multer code is ending here


// call add profile form route get route
router.get("/addprofile", (req, res) => {
    res.render("profile/addprofile");
  });
  
  // call profile page route
  router.get('/userprofile', (req, res) => {
    Profile.find({}).then(profile => {
      res.render('profile/userprofile', {
        profile:profile
      })
    }).catch(err => console.log(err))
  });
  
  
  //create editprofile route
  
  router.get('/editprofile/:id',(req,res)=>{
   Profile.findOne({_id:req.params.id})
   .then( profile =>{
     res.render('profile/editprofile',{
       profile:profile
     })
   })
  .catch(err => console.log(err))
  
  })
  
  //create profile by using http post method
  router.post('/addprofile', upload.single('photo'), (req, res) => {
      const errors = [];
      if (!req.body.name) {
          errors.push({text : 'name is required'})
      }
      if (!req.body.phonenumber) {
          errors.push({text : 'phone number is required'})
      }
      if (!req.body.company) {
        errors.push({ text: "company is required" });
      }
      if (!req.body.location) {
        errors.push({ text: "location  is required" });
      }
      if (!req.body.education) {
        errors.push({ text: "education is required" });
      }
      if (errors.length > 0) {
          res.render('profile/addprofile', {
              errors: errors,
              name: req.body.name,
              phonenumber: req.body.phonenumber,
              company: req.body.company,
              location: req.body.location,
              education : req.body.education
          })
      } else {
          const newProfile = {
              photo: req.file,
              name: req.body.name,
              phonenumber: req.body.phonenumber,
              company: req.body.company,
              location: req.body.location,
              education : req.body.education
          }
          new Profile(newProfile)
            .save()
              .then(profile => {
                  console.log(profile);
                  res.redirect('/profile/userprofile');
                  req.flash('success_msg','successfully profile created');
            })
            .catch(err => console.log(err));
      }
  });
  //edit profile put method route here
  router.put('/editprofile/:id', upload.single('photo'),(req,res)=>{
    Profile.findOne({_id:req.params.id})
    .then(profile =>{
      profile.photo=req.file
     profile.name= req.body.name;
     profile.phonenumber=req.body.phonenumber;
     profile.company=req.body.company;
     profile.location=req.body.location;
     profile.education=req.body.education
  //after this need to save this data to database
  profile.save().then(profile =>{
    res.redirect('/profile/userprofile');
     req.flash('success_msg','successfully profile updated');
  }).catch(err => console.log(err))
  
    }).catch(err =>console.log(err) )
  })
  
  //delete profile route with of http delete method
  router.delete("/deleteprofile/:id",(req,res)=>{
    Profile.remove({_id : req.params.id})
    .then(profile=>{
      res.redirect('/profile/userprofile');
      req.flash('success_msg','successfully profile deleted');
    }).catch(err => console.log(err))
  });

module.exports= router;
