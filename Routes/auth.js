const express= require('express');
const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');
const passport=require("passport")
const router = express.Router();



require('../Model/User');
const User= mongoose.model("users");

router.get('/login', (req,res)=>{
    res.render('auth/login')
});
router.get('/register',(req,res)=>{
    res.render('auth/register')
});

router.post("/register",(req,res)=>{
    const errors=[];
    if(req.body.password != req.body.confirmpassword){
        errors.push({text :'password is not matching'})
    }
    if(req.body.password.length < 4){
        errors.push({text :'Password should be minimum 4 charcters'})
    }
    if(errors.length > 0){
        res.render('auth/register',{
            errors:errors,
            username:req.body.username,
            email:req.body.email,
            password:req.body.password,
            confirmpassword:req.body.confirmpassword
        });
    }else {
        //connect to database and store user information
        User.findOne({email:req.body.email}).then(user =>{
            if(user){
                req.flash('error_msg', "email is already exits")
                res.redirect("/user/register");
            }else {
                const newUser= new User({
                    username:req.body.username,
                    email:req.body.email,
                    password:req.body.password,
                    confirmpassword:req.body.confirmpassword
                });
                //salting password
                bcrypt.genSalt(10,(err,salt)=>{
                    bcrypt.hash(newUser.password,salt,(err,hash)=>{
                        if(err) throw err;
                        newUser.password = hash;
                        newUser.save().then( user =>{
                            req.flash('success_msg','successfully registerd');
                            res.redirect('/user/login')
                        })
                        .catch(err => console.log(err))
                    });
                })
                
            }

        }).catch(err => Console.log(err))
    }
});

router.post("/login",(req,res,next)=>{
    passport.authenticate("local",{
        successRedirect:"/profile/userprofile",
        failureRedirect:"/user/login",
        failureFlash:true
    }) (req,res,next);
});

 router.grt('/logout',(req,res)=>{
     req.logout();
     res.flash("success_msg","successfully logout");
     res.redirect("/user/login");
 })
module.exports= router;