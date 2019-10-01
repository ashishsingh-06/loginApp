// require modules
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const morgan = require('morgan');
const passport = require('passport');

//passport config
require('./config/passport')(passport);

//index routes from routes folder
const indexRoutes = require('./routes/index');
//user routes from routes folder
const userRoutes  = require('./routes/users');

// init app 
const app = express();

app.use(morgan('dev'));

// DB config
const db = require('./config/keys').mongoUri;
mongoose.connect(db,{useNewUrlParser: true,useUnifiedTopology:true})
    .then((result)=>{
            console.log('Database Connected...');
    })
    .catch((err)=>{
        console.log(err);
    });

// EJS
app.use(expressLayouts);
app.set('view engine','ejs');

// body-parser
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

app.use(session({
    secret : 'secretkey',
    resave : true,
    saveUninitialized : true,
}));

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

// connect flash
app.use(flash());

//global vars
app.use((req,res,next)=>{

    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');

    next();
});
 
//middleware
app.use('/',indexRoutes);
app.use('/users',userRoutes);




// port
const port = process.env.PORT || 5000;

//listening to port 5000
app.listen(port,()=>{
    console.log(`server started on port ${port}`);
});