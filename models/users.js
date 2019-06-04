const mongoose = require('mongoose');

let schema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String

    },
    phone: {
        type: String
    },
    password: {
        type: String
    },
    profile: {
        type: String
    },
    bio: {
        type: String
    },
    isActive:{
        type:Boolean
    },
    token:{
        type:String
    },
    follower: {
        type: Array,

    },
    following:{
        type:Array
    }

});

let user = module.exports=mongoose.model('Users',schema);