const mongoose = require('mongoose')
const CourseSchema = mongoose.Schema({
    name:{
        type:String,
        Require:true,
    },
    email:{
        type:String,
        Require:true,
    },
    phone:{
        type:String,
        Require:true,
    },
    dob:{
        type:String,
        Require:true,
    },
    address:{
        type:String,
        Require:true,
    },
    gender:{
        type:String,
        Require:true,
    },
    education:{
        type:String,
        require:true,
    },
    course:{
        type:String,
        require:true,
    },
    user_id:{
        type:String,
        require:true,
    },
    status:{
        type:String,
        default:"panding"
    },
    comment:{
        type:String,
        default:"panding"
    }

},{timestamps:true});
const CourseModel = mongoose.model('course',CourseSchema);
module.exports = CourseModel;
