const express = require('express');
const user_Route = express.Router()
const userController = require('../controllers/userController');
const path = require('path');


const session = require('express-session');
const config = require('../config/config')
user_Route.use(session({
    secret: config.sessionSecret,
    resave: true,
    saveUninitialized: true
}))

const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, path.join(__dirname,'../static/userImage') )
    },
    filename: (req, file, cb)=>{
        const name = Date.now()+"-"+file.originalname
        cb(null, name)
    }

})
const upload = multer({storage: storage})


user_Route.get('/', userController.loadHome)

user_Route.post('/', upload.single('image'),userController.userRegistration)



user_Route.get('/login', userController.loadLogin)
user_Route.post('/login', userController.checkLogin)

user_Route.get('/logout', userController.userLogout)

user_Route.get('/edit-user', userController.userEdit)
user_Route.post('/edit-user',upload.single('image'), userController.updateUserEdit)

user_Route.get('/verify', userController.verifyEmail)


user_Route.get('/contact-us', userController.loadContact)
user_Route.post('/contact-us', userController.contactSubmit)





module.exports = user_Route