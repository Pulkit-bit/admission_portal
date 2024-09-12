const express = require('express');
const FrontController = require('../controllers/FrontController');
const route = express.Router();
const checkUserAuth = require('../middleware/auth');
const CourseController = require('../controllers/CourseController');
const AdminController = require('../controllers/AdminController');

// route.get('/', (req,res) => {
//     res.render("login")
// })

// route.get('/register', (req,res) => {
//     res.render("register")
// })
// route.get('/signup', (req,res) => {
//     res.render("signup")
// })

route.get('/',FrontController .login)
route.get('/register',FrontController.register)
route.get('/home',checkUserAuth,FrontController.home)
route.get('/header',FrontController.header)
route.get('/footer',FrontController.footer)
route.get('/profile',checkUserAuth,FrontController.profile)
route.post('/changePassword',checkUserAuth,FrontController.changePassword)
route.post('/updateProfile',checkUserAuth,FrontController.updateProfile)




//userinsert
route.post('/userInsert',FrontController.userInsert)
//verifylogin
route.post('/verifyLogin',FrontController.verifyLogin)
//logout
route.get('/logout',FrontController.logout)


//course
route.post('/course_insert',checkUserAuth,CourseController.courseInsert)
route.get('/courseDisplay',checkUserAuth,CourseController.courseDisplay)
route.get('/courseView/:id',checkUserAuth,CourseController.courseView)
route.get('/courseEdit/:id',checkUserAuth,CourseController.courseEdit)
route.post('/courseUpdate/:id',checkUserAuth,CourseController.courseUpdate)
route.get('/courseDelete/:id',checkUserAuth,CourseController.courseDelete)

//admin controller
route.get('/admin/display',checkUserAuth,AdminController.display)
route.post('/admin/updateStatus/:id',checkUserAuth,AdminController.updateStatus)


module.exports = route;