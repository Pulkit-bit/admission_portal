const jwt = require('jsonwebtoken')
const UserModel = require ('../models/user')

const checkUserAuth = async(req,res,next) => {
    // console.log("hello auth");
    const{token} = req.cookies
    if (!token) { 
        req.flash('error','Unauthorised user please login')
        res.redirect('/')
    } else {
        const verifyLogin = jwt.verify(token,'sunilpal@123')
        // console.log(verifyLogin)
        const userData = await UserModel.findOne({_id:verifyLogin.ID})
        // console.log(userData)
        req.Udata = userData
        next()
    }

}

module.exports = checkUserAuth;