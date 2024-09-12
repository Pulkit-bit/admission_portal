const express = require('express')
const app = express();

// console.log(app)
const PORT = 4000
const dotenv = require('dotenv')
dotenv.config({path: './.env'})
const web = require('./routes/web')
const connectDB = require('./Db/connectDB')
const session = require('express-session')
const flash = require('connect-flash')
const fileupload = require('express-fileupload')
const cookiParaser = require('cookie-parser')

//token get cookies
app.use(cookiParaser())

app.use(fileupload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));

//session
app.use(session({
    secret:'secret',
    resave:true,
    saveUninitialized:true
}));


//flash message
app.use(flash())

//parse application/x-www-form-urlencoded data get
app.use(express.urlencoded({extended : false}))

//ejs set for html css
app.set('view engine', 'ejs')


// Serving static files in Express  
app.use(express.static('public'))
app.use(express.static('files'))

// app.get('/',(req,res) => {
    //     res.send("this is my home page")
    // })
    // app.get('/login',(req,res) => {
//     res.send("this is my login page")
// })

//connectDB
connectDB()

//use the rout
app.use('/',web)

//server create
app.listen(process.env.PORT,() =>{
    console.log(`server start on localhost ${process.env.PORT}`)
})