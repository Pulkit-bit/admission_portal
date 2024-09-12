const UserModel = require('../models/user');
const bcrypt = require('bcrypt')
const cloudinary = require('cloudinary')
const jwt = require('jsonwebtoken');
const CourseModel = require('../models/coursemodel');
 // Configuration
 cloudinary.config({ 
    cloud_name: 'dc053abet', 
    api_key: '213483246812592', 
    api_secret: 'hEPstdKyQQxq24aRmHrKqEzOOGg' // Click 'View Credentials' below to copy your API secret
});


class FrontController {
    // Render the login page
    static login = async (req, res) => {
        try {
            res.render("login",{message:req.flash('success'),msg:req.flash('error')});
        } catch (error) {
            console.log(error);
        }
    }

    // Render the registration page with any error messages
    static register = async (req, res) => {
        try {
            res.render("register",{msg:req.flash('error')});
        } catch (error) {
            console.log(error);
        }
    }

    // Handle user registration
    static userInsert = async (req, res) => {
        try {
            // console.log(req.files.image)
            
            const file = req.files.image
            const imageUpload = await cloudinary.uploader.upload(file.tempFilePath,{
                folder:"userimage"
            })
            console.log(imageUpload)
            const { name, email, password, confirm_password } = req.body;
            const user = await UserModel.findOne({ email: email });

            if (user) {
                req.flash('error', 'Email already exists');
                res.redirect('/register');
            } else {
                if (name && email && password && confirm_password) {
                    if (password === confirm_password) {
                        const haspassword = await bcrypt.hash(password,10)
                        const result = new UserModel({
                            name: name,
                            email: email,
                            password: haspassword,
                            image:{
                                public_id:imageUpload.public_id,
                                url :imageUpload.secure_url ,
                            }
                        });
                        await result.save();
                        req.flash('success','register successfully  insert please login')
                        res.redirect('/');
                    } else {
                        req.flash('error', 'Password and confirm password do not match');
                        res.redirect('/register');
                    }
                } else {
                    req.flash('error', 'All fields are required');
                    res.redirect('/register');
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    //verifyLogin
    static verifyLogin = async(req,res) =>{
        try {
            // console.log(req.body)
            const{email,password} = req.body
            const user = await UserModel.findOne({email:email})
            if (user) {
                const isMatchh = await bcrypt.compare(password,user.password)     
                // console.log(isMatchh)    
                if (isMatchh) {
                    
                    // Handle multiple login roles
                    const token = jwt.sign({ ID: user._id }, 'sunilpal@123');
                    res.cookie('token', token);

                    if (user.role === "admin") {
                        res.redirect('/admin/display');
                    } else if (user.role === "student") {
                        res.redirect('/home');
                    }

                } else {
                    req.flash('error','Email or password is not same')
                    res.redirect('/')
                }   
            } else {
                req.flash('error','You are not register user please register first')
                res.redirect('/')
            }
        } catch (error) {
            console.log(error)
        }
    }

    static home = async(req,res) =>{
        try {
            const {name,email,image,id} = req.Udata
            const online_education = await CourseModel.findOne({ user_id: id, course: 'online_education' });
            const program_course = await CourseModel.findOne({ user_id: id, course: 'program_course' });
            const campus_event = await CourseModel.findOne({ user_id: id, course: 'campus_event' });
            const sports_game = await CourseModel.findOne({ user_id: id, course: 'sports_game' });
            // console.log(name,email)
            res.render("home", { n: name, i: image, e: email,online_education:online_education,program_course:program_course,campus_event:campus_event,sports_game:sports_game });
        } catch (error) {
            console.log(error)
        }
    }

    static header = async(req,res) =>{
        try {
            res.render('header')
        } catch (error) {
            console.log(error)
        }
    }

    static footer = async(req,res) =>{
        try {
            res.render('footer')
        } catch (error) {
            console.log(error)
        }
    }

    static logout = async(req,res) =>{
        try {
            res.clearCookie('token');
            res.redirect('/')
        } catch (error) {
            console.log(error)
        }
    }

    static profile = async(req,res) =>{
        try {
            // console.log(req.Udata);
            const{name,email,image} = req.Udata;
            res.render('profile',{ n: name, i: image, e: email})
        } catch (error) {
            console.log(error)
        }
    }
    
    static changePassword = async (req, res) => {
        try {
          const { id } = req.Udata;
          //console.log(req.body)
          const { op, np, cp } = req.body;
          if (op && np && cp) {
            const user = await UserModel.findById(id);
            const isMatched = await bcrypt.compare(op, user.password);
            if (!isMatched) {
              req.flash("error", "Current password is incorrect ");
              res.redirect("/profile");
            } else {
              if (np != cp) {
                req.flash("error", "Password does not match");
                res.redirect("/profile");
              } else {
                const newHashPassword = await bcrypt.hash(np, 10);
                await UserModel.findByIdAndUpdate(id, {
                  password: newHashPassword,
                });
                req.flash("success", "Password Updated successfully ");
                res.redirect("/");
              }
            }
          } else {
            req.flash("error", "ALL fields are required ");
            res.redirect("/profile");
          }
        } catch (error) {
          console.log(error);
        }
    };


    static updateProfile = async (req, res) => {

        try {
            const { id } =  req.Udata;
            const { name, email } = req.body;
          if (req.files) {
            const user = await UserModel.findById(id);
            const imageID = user.image.public_id;
            console.log(imageID);
    
            //deleting image from Cloudinary
            await cloudinary.uploader.destroy(imageID);
            //new image update
            const imagefile = req.files.image;
            const imageupload = await cloudinary.uploader.upload(
              imagefile.tempFilePath,
              {
                folder: "userprofile",
              }
            );
            var data = {
              name: name,
              email: email,
              image: {
                public_id: imageupload.public_id,
                url: imageupload.secure_url,
              },
            };
          } else {
            var data = {
              name: name,
              email: email,
            };
          }
          await UserModel.findByIdAndUpdate(id, data);
          req.flash("success", "Update Profile successfully");
          res.redirect("/profile");
        } catch (error) {
          console.log(error);
        }
    };


    
    


    

    
}

module.exports = FrontController;
