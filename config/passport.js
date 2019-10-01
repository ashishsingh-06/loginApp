const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// local user model 
const User = require('../models/User');

module.exports = function(passport){
    passport.use(
        new localStrategy({ usernameField: 'email' }, (email,password,done)=>{

            //Match User
            User.findOne({ email: email})
            .then(result => {
                if(!result)
                {
                    return done(null,false,{ message:'Email not registered'});
                }
                else
                {
                    //match password
                    bcrypt.compare(password,result.password, (err,ismatch)=>{

                        if(err) throw err;

                        if(ismatch)
                        {
                            return done(null,result);
                        }
                        else
                        {
                            done(null,false, {message: 'Password incorrect'});
                        }
                    });
                }
            })
            .catch(err=> console.log(err));

        })
    );

    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
      
      passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
          done(err, user);
        });
      });
}

