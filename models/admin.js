const express = require('express');
const mongoose = require('mongoose');


let schema = mongoose.Schema({
    name: {
        type: String,
        required: true
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

});


let admin = module.exports=mongoose.model('Admin',schema);