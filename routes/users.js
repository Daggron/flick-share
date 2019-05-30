const express = require('express');
let router = express.Router();
const bodyParser= require('body-parser');
let urlencoded=bodyParser.urlencoded({extended:false});
const User = require('../models/users');
const bcrypt = require('bcryptjs');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const Post = require('../models/posts')
const passport = require('passport');
const config = require('../config/database');
const multer = require('multer');
const path = require('path');



const storage = multer.diskStorage({
    destination: './public/profile/',
    filename: function(req, file, cb){
      cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });
  

  const upload = multer({
    storage: storage,
    // increase the size from 3000000 to let users to upload a file greater than 3 MB the units are bits so that is ehy 3MB is equal to 3000000
    limits:{fileSize: 9000000},
    fileFilter: function(req, file, cb){
      checkFileType(file, cb);
    }
  }).single('profilephoto');
  
  function checkFileType(file, cb){
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);
  
    if(mimetype && extname){
      return cb(null,true);
    } else {
      cb('Error: Images Only!');
      
    }
  }

  
router.get('/',(req,res)=>{
    User.find({},(err , users)=>{
        if (err) {
            console.log(err);
        }
       res.render('users.ejs',{users:users});
    });
});






  //For registeration
router.get('/register',(req,res)=>{
    res.render('registeration',{errors:''});
});


//User Registeration Form   
router.post('/register',urlencoded,(req,res)=>{

    upload(req,res,(err)=>{
    const name=req.body.name;
    const email=req.body.email;
    const unmae=req.body.username;
    const password=req.body.password;
    const password2=req.body.password2;
    const phone=req.body.phoneNumber;
    const bio=req.body.bio;
   
    console.log(name+" "+email+" "+password+" "+password2+" "+unmae);
    req.checkBody('name','Name is required').notEmpty();
    req.checkBody('email','Email is required').notEmpty();
    req.checkBody('email','Email is not valid').isEmail();
    req.checkBody('password','Password is required').notEmpty();
    req.checkBody('password2','Password Do not Match').equals(req.body.password);
    req.checkBody('phoneNumber','Please Enter a valid phone number').notEmpty();
    let errors = req.validationErrors();

    if(errors){
        res.render('registeration',{errors:errors});
        console.log(errors);


    }
    else{
       
                    const user = new User({
                        name:name,
                        username:unmae,
                        email:email,
                        password:password,
                        phone:phone,
                        bio:bio,
                        profile:`profile/${req.file.filename}`
                    });

        //Hashing the password in order to keep the user password save 
        //the hasing is of 10 characters change the value below if you want  a high level security the hashing algo used is MD5

        bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(user.password,salt,(err,hash)=>{
                if(err){
                    console.log(err);
                }
                user.password=hash;
                user.save((err)=>{
                    if(err){
                        console.log(err);
                    }
                    else{
                        req.flash('success','You Have Registerd Successfully');
                        res.redirect('login');
                    
                    }
                });   
                
            });
        });
    }
});
             

 });



router.get('/login',(req,res)=>{
    res.render('login');
});  

router.post('/login',urlencoded,(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect:'/home',
        failureRedirect:'/users/login',
        failureFlash:true
    })(req,res,next);

});

//Logout router

router.get('/logout',(req,res)=>{
    req.logout();
    req.flash('Success','You are logged out successfully');
    res.redirect('/');
    
});






router.post('/update/follow/:id',urlencoded,(req,res)=>{

    let query={_id:req.user._id};
    let user={};
    user.follower=user.follower.push(req.params.id);
    User.update(query,user,(err)=>{
        //res.redirect(`/users/${req.params.id}`);
        console.log(user.follower);
        console.log('i did this');
        res.send("success");
    })


});

router.get('/update/follow/:id',urlencoded,(req,res)=>{
    User.findById({_id:req.params.id},(err,posts)=>{
        res.redirect(`/users/${req.params.id}`);
    });




});


router.get('/update/:id',(req,res)=>{
    User.findById(req.params.id,(err,found)=>{
        res.render("update.ejs",{found:found});
    });

});




router.post('/update/:id',urlencoded,(req,res)=>{
    let found = User.findById(req.params.id);
    upload(req,res,(err)=>{
        let user = {};
        if(found.profile===req.body.profile){
            user.bio=req.body.bio;
        }
        else{
            user.profile=`profile/${req.file.filename}`;
            user.bio=req.body.bio;
        }

        let query={_id:req.params.id};
        User.update(query,user,(err)=>{
            res.redirect('/users/');
        })
    })


});


router.get('/:id',(req,res)=>{
    User.findById(req.params.id,(err,user)=>{
        if(err){
            console.log(err);
        }
        Post.find({posted:user.id},(err,posts)=>{
            if (err){
                console.log(err);
            }
            res.render('profile.ejs',{posts:posts,user:user});
            console.log(req.user.follower);
        });
    })
});






module.exports=router;
