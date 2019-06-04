const express = require('express');
const router = express.Router();
const User = require('../models/users');



router.get('/',(req,res)=>{
    User.find({},(err,users)=>{
        res.render('admin.ejs',{user:users});
    });

});















module.exports=router;