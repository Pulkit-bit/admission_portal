const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        Require : true
    },
    email:{
        type:String,
        Require : true
    },
    password:{
        type:String,
        Require: true
    },
    image:{
        public_id:{
            type:String,
            Require: true,
        },
        url:{
            type:String,
            Require: true
        }
    },
    role:{
        type:String,
        default: "student",
    }
});

const UserModel = mongoose.model('userss',UserSchema)
module.exports = UserModel;