const experess = require('express');
const router = experess.Router();
const {ensureAuthenticated } = require('../config/auth');

router.get('/',(req,res,next)=>{

        res.render('welcome');
});


router.get('/dashboard',ensureAuthenticated,(req,res,next)=>{
        
        res.render('dashboard');
});
module.exports = router;
