const express = require('express');
const  admin_Route = express.Router()
const session = require('express-session')
const adminController = require('../controllers/adminController');
const adminAuth = require('../middleware/adminAuth');
const config = require("../config/config")

admin_Route.use(session({
    secret: config.sessionSecret,
    resave: true,
    saveUninitialized: true
}))

const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, path.join(__dirname, '../static/vendorImage'))
    },
    filename: (req, file, cb)=>{
        const name = Date.now()+"-"+file.originalname
        cb(null, name)
    }
    
})

const upload = multer({storage: storage})

admin_Route.get('/', adminAuth.isLogout,adminController.loadAdminLogin)
admin_Route.post('/', adminController.checkAdminLogin)

admin_Route.get('/home',adminAuth.isLogin, adminController.loadAdminHome)

admin_Route.get('/dashboard',adminAuth.isLogin, adminController.laodAdminDashboard)

admin_Route.get('/edit-user',adminAuth.isLogin,adminController.laodUserEditByAdmin)
admin_Route.post('/edit-user',adminAuth.isLogin,adminController.userEditByDetails)

admin_Route.get('/delete-user', adminAuth.isLogin, adminController.userDeleteByAdmin)

admin_Route.get('/category-vendor', adminController.adminVendors)
admin_Route.get('/vendors',adminController.showVendors)

admin_Route.get('/add-vendor',adminController.loadAddVendorByAdmin)
admin_Route.post('/add-vendor',upload.single('image'),adminController.addVendorByAdmin)

admin_Route.get('/edit-vendor',adminController.loadEditVendorByAdmin)
admin_Route.post('/edit-vendor',upload.single('image'),adminController.editVendorByAdmin)

admin_Route.get('/delete-vendor',adminController.deleteVendorByAdmin)


module.exports = admin_Route