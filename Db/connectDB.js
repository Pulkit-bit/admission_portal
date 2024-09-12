const mongoose = require('mongoose');
const Local_Url = 'mongodb://127.0.0.1:27017/admission_portal';

const connectDB = () =>{
    return mongoose.connect(Local_Url)
    .then(() => {
        console.log('mongoose connected successfully')
    }).catch((error) => {
        console.log(error)
    });
}


module.exports = connectDB