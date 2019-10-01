const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');


//logout

router.get('/logout',(req,res,next)=>{

        res.render('login');
});


// login
router.get('/login',(req,res,next)=>{

        res.render('login');
}); 


// register
router.get('/register',(req,res,next)=>{

         res.render('register');
});

// register form
router.post('/register',(req,res,next)=>{
        
        const {name, email , password, password2} = req.body;

        let errors = [];

        if(!name || !email || !password || !password2)
        {
                errors.push({msg: 'please fill all fields'});
        }

        if(password!==password2)
        {
                errors.push({msg: 'Please confirm the password'});
        }

        if(password.length<8)
        {
                errors.push({
                        msg: 'password must be atleast 8 characters long'
                })
        }

        if(errors.length>0)
        {
                res.render('register',{
                        errors,
                        name,
                        email,
                        password,
                        password2
                });
        }
        else
        {
                // validation pass
                User.findOne({email : email})
                .then((result)=>{
                        if(result)
                        {
                                // user exists
                                errors.push({msg: 'Email already registered'});
                                res.render('register',{
                                        errors,
                                        name,
                                        email,
                                        password,
                                        password2
                                });
                        }
                        else
                        {
                                const newUser = new User({
                                        name : name,
                                        email : email,
                                        password : password
                                });

                                //hash password

                                 bcrypt.genSalt(10,(err,salt)=>{

                                         bcrypt.hash(newUser.password,salt,(err,hash)=>{

                                                if(err)
                                                {
                                                        throw err;
                                                        console.log(err);
                                                        
                                                }
                                                else
                                                {
                                                        newUser.password = hash;
                                                        newUser.save()
                                                        .then(result=>{
                                                                req.flash('success_msg','Registration Successful, Please login to continue');
                                                                res.redirect('/users/login');
                                                                
                                                        })
                                                        .catch(err=>console.log(err));
                                                }
                                         });
                                 })

                                
                        }

                }).catch((err)=>{
                        console.log(err);
                        
                });
                
        }
        
});

// login handle

router.post('/login',(req,res,next)=>{

        passport.authenticate('local',{
                successRedirect : '/dashboard',
                failureRedirect: '/users/login',
                failureFlash: true 
        })(req,res,next);

});


module.exports = router;