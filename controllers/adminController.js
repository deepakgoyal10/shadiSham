const userModel = require('../models/userModel');

const vendorModel = require('../models/vendorModel');

const loadAdminLogin = async(req, res)=>{
    try {
        res.render('adminLogin')
    } catch (error) {
        console.log('loadAdminLogin: '+ error.message)
    }
}

const checkAdminLogin = async(req, res)=>{
    const email = req.body.email
    const password = req.body.password
    const userData = await userModel.findOne({email:email})
    if (userData){
    if (password == userData.password){
        if (userData.is_admin == 1) {
            req.session.admin_id = userData._id
            res.redirect("/admin/home")
        } else {
        res.render('adminLogin',{message: 'Invalid username or password'})
            
        }
    }else{
        res.render('adminLogin',{message: 'Invalid username or password'})
        
    }
    }else{
        res.render('adminLogin',{message: 'Invalid username or password'})
    }

}


const loadAdminHome = async(req, res)=>{
    try {
        res.render('adminHome')
    } catch (error) {
        console.log('loadAdminHome: '+ error.message)
    }
}


const laodAdminDashboard = async(req, res)=>{
    try {
       const  userData = await userModel.find({is_admin: '0'})
        if (userData){
            res.render('adminDashboard',{user: userData})
        }
        else{
            res.render('adminDashboard', {message: 'unable to fetch data'})
        }

    } catch (error) {
        console.log('loadAdminDashboard: ', error.message)
    }
}



const laodUserEditByAdmin = async(req, res)=>{
    try {
        const user_id = req.query.id
        const userData = await userModel.findById({_id: user_id})
        if (userData){
            res.render('editUserByAdmin', {user: userData})
        }else(
            res.render('editUserByAdmin',{message: 'Unable to fetch Data'})
        )



    } catch (error) {
        console.log('loadUserEditByAdmin: '+error.message)
    }
}


const userEditByDetails = async(req, res)=>{
    const user_id = req.body.id
    const userData = await userModel.findByIdAndUpdate({_id: user_id}, {$set:{name: req.body.name, email: req.body.email, phone: req.body.phone, is_verified: req.body.verification}}).then(() => {
        res.redirect('/admin/dashbaord')
        
    }).catch((err) => {
        res.send('Unable to update info')
        console.log('userEditByDetails: '+err.message)
    });
    }


const userDeleteByAdmin = async(req, res)=>{
    const user_id = req.query.id
    const userData = await userModel.findByIdAndDelete({_id : user_id}).then(() => {
        res.redirect('/admin/dashboard')
    }).catch((err) => {
       console.log('userDeleteByAdmin',err.message) 
    });
    
}

const adminVendors = async(req, res)=>{
    try {
        const vendorData = await vendorModel.find()
        let nonFilterCat =[]
        for (let i = 0; i<vendorData.length; i++){
                nonFilterCat.push(vendorData[i].category)
        }

        const filterdCat = [...new Set(nonFilterCat)]

        
        res.render('adminVendorsCategory',{category: filterdCat})
    } catch (error) {
        console.log('adminVendors: ',error.message)
    }
}

const showVendors = async(req, res)=>{
    try {
        const category = req.query.category
        const venderData = await vendorModel.find({category: category})
        if (venderData) {
            res.render('adminVendors',{vendor: venderData})
        } else {
            res.render('adminVendors',{message: 'error Fetching data'})
        }
    
    } catch (error) {
        console.log("showVendors: ", error.message)
    }
}

const loadAddVendorByAdmin = async(req, res)=>{
    try {
        res.render('addVendorbyAdmin')
    } catch (error) {
        console.log('addVendorByAdmin: ', error.message)
    }
}

const addVendorByAdmin = async(req, res)=>{
    try {
        
        const vendorData = new vendorModel({
            category: req.body.category,
            name: req.body.name,
            email: req.body.email,
            location: req.body.location,
            phone: req.body.phone,
            image:  req.file.filename,
            price: req.body.price,
        }).save().then(() => {
            res.redirect('/admin/category-vendor')
        }).catch((err) => {
            res.render('addVendorbyadmin',{message:"Error adding Vendor"})
        });

    } catch (error) {
        console.log('addVendorByAdmin: ', error.message)
    }
}

const loadEditVendorByAdmin = async(req, res)=>{
    try {
        const vendor_id = req.query.id
        const venderData = await vendorModel.findById({_id: vendor_id})
        res.render('editVendorByAdmin', {vendor : venderData})
    } catch (error) {
        console.log('loadEditVendorByAdmin: ', error.message)
    }
}

const editVendorByAdmin = async(req, res)=>{
    try {
        const vendor_id = req.body.id
        const category = req.body.cat
        if (req.file){
            const vendorData = await vendorModel.findByIdAndUpdate({_id: vendor_id}, {$set:{
                name: req.body.name,
                email: req.body.email,
                location: req.body.location,
                phone: req.body.phone,
                image:  req.file.filename,
                price: req.body.price
            }})
                if (vendorData) {
                      const catVendor = await vendorModel.find({category: category})
                      if (catVendor) {
                        res.render('adminVendors',{vendor: catVendor})
                      } else {
                    res.render('adminVendors',{message: 'Unable to fetch data after deleting'})
                        
                      }
                } else {
                    res.render('editVendorByAdmin: ', {message: 'Error updating!'})
                }

        }else{
            const vendorData = await vendorModel.findByIdAndUpdate({_id: vendor_id}, {$set:{
                name: req.body.name,
                email: req.body.email,
                location: req.body.location,
                phone: req.body.phone,
                price: req.body.price
            }})
                if (vendorData) {
                      const catVendor = await vendorModel.find({category: category})
                      if (catVendor) {
                        res.render('adminVendors',{vendor: catVendor})
                      } else {
                    res.render('adminVendors',{message: 'Unable to fetch data after deleting'})
                        
                      }
                } else {
                    res.render('editVendorByAdmin: ', {message: 'Error updating!'})
                }
        }
       
      
    } catch (error) {
        console.log('editVendorByAdmin: ',error.message)
    }
}

const deleteVendorByAdmin = async(req, res)=>{
    try {
        const vendor_id = req.query.id
        const category = req.query.cat
        const delelteVendor = await vendorModel.findByIdAndDelete({_id: vendor_id})

        if(delelteVendor){
            const vendorData = await vendorModel.find({category: category})
            if (vendorData) {
                res.render('adminVendors',{vendor: vendorData})
            } else {
                res.render('adminVendors',{message: 'Unable to fetch data after deleting'})
            }
        }
        else{
            console.log('deleteVendorByAdmin/deleteVendor: unable to delete')
        }

    } catch (error) {
        console.log('deleteVendorByAdmin: '+error.message)
    }
}




module.exports = {

    loadAdminLogin,
    checkAdminLogin,
    loadAdminHome,
    laodAdminDashboard,
    laodUserEditByAdmin,
    userEditByDetails,
    userDeleteByAdmin,
    adminVendors,
    showVendors,
    loadAddVendorByAdmin,
    addVendorByAdmin,
    loadEditVendorByAdmin,
    editVendorByAdmin,
    deleteVendorByAdmin
}