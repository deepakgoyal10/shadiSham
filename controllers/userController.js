const userModel = require("../models/userModel");
const nodemailer = require('nodemailer');
const contactModel = require("../models/contactModel");
const e = require("express");
const config = require('../config/config')

const loadHome = async (req, res) => {
  try {
    if (req.session.user_id) {

      const userData = await userModel.findById({ _id: req.session.user_id });

      if (userData) {
        res.render("home", { user: userData });
      } else {

        res.render("home");
      }
    }
    else {

      res.render("home");
    }
  } catch (error) {
    console.log("loadHome: " + error.message);
  }
};

const sendVerificationMail = async (email, subject, html) => {

  try {

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      requirTLS: true,
      auth: {
        user: config.myMail,
        pass: config.myPass
      }
    })
    const mailOption = {
      from: config.myMail,
      to: email,
      subject: subject,
      html: html
    }
    transporter.sendMail(mailOption, (error, info) => {
      if (error) {
        console.log('sendVerificationMail 1: ', error)
      } else {
        console.log('Email has been sent successfully', info.response)
      }
    })
  } catch (error) {
    console.log('sendVerificationMail: ', error.message)
  }
}



const userRegistration = async (req, res) => {
  try {
    const userData = new userModel({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      image: req.file.filename,
      password: req.body.password

    });
    userData
      .save()
      .then(() => {

        const email = req.body.email
        const name = req.body.name
        const userId = userData._id
        const subCont = [
          { subject: 'Email Verification!' }, {
            html: '<p> hey ' + name + ' <a href="http://localhost:80/verify?id=' + userId + '">Click here</a> to Verify Your mail for registration on Shadisuwidha. </p>'
          }
        ]


        sendVerificationMail(email, subCont[0]['subject'], subCont[1]['html'])
        res.render("home", {
          message:
            "Verification Mail has been sent to your registerd Email Please click on that link to verify",
        });
      })
      .catch((err) => {
        res.render("home", { message: "Error, Try again!" });
      });
  } catch (error) {
    console.log("userRegistration: " + error.message);
  }
};

const verifyEmail = async (req, res) => {
  try {
    const userId = req.query.id
    const userData = await userModel.findByIdAndUpdate({ _id: userId }, { $set: { is_verified: '1' } })
    if (userData) {
      res.send('Email Verification success')
    } else {

      res.send('Email Verification failed try Again')
    }
  } catch (error) {
    console.log('verifyEmail: ', error.message)
  }
}



const loadLogin = async (req, res) => {
  try {
    if (req.session.user_id) {
      const userData = await userModel.findById({ _id: req.session.user_id });
      if (userData) {
        res.render("login", { user: userData });
      } else {
        res.render("login");
      }
    }
    else {

      res.render("login");
    }
  } catch (error) {
    console.log("loadLogin: " + error.message);
  }
};

const checkLogin = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const userData = await userModel.findOne({ email: email });

    if (userData) {
      if (userData.password == password) {
        req.session.user_id = userData._id;
        res.redirect("/");
      } else {
        res.render("login", { message: " Invalid password" });
      }
    } else {
      res.render("login", { message: "Invalid Username and password" });
    }
  } catch (error) {
    console.log("checkLogin: " + error.message);
  }
};

const userLogout = async (req, res) => {
  try {
    req.session.destroy();
    // res.render('login')
    res.redirect("/login");
  } catch (error) {
    console.log("userLogout: " + error.message);
  }
};

const userEdit = async (req, res) => {
  try {
    const userData = await userModel.findById({ _id: req.session.user_id });
    res.render("userEditProfile", { user: userData });
  } catch (error) {
    console.log("userEdit: " + error.message);
  }
};

const updateUserEdit = async (req, res) => {
  try {
    const user_id = req.body.id;
    const userData = await userModel.findByIdAndUpdate(
      { _id: user_id },
      {
        $set: {
          name: req.body.name,
          email: req.body.email,
          phone: req.body.phone,
          image: req.file.filename
        },
      }
    );
    if (userData) {
      res.redirect("/login");
    } else {
      res.render("userEditProfile", { message: "Error updating your profile" });
    }
  } catch (error) {
    console.log("updateUserEdit: " + error.message);
  }
};

const loadContact = async (req, res) => {
  try {
    if (req.session.user_id) {
      const user_id = req.session.user_id

      userData = await userModel.findById({ _id: user_id })
      if (userData) {

        res.render("contactForm", { user: userData });
      } else {
        res.render('contactForm')
      }
    }
    else {
      res.render('contactForm')

    }

  } catch (error) {
    console.log("loadContact: " + error.message);
  }
};

const contactSubmit = async (req, res) => {
  try {

    new contactModel({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      state: req.body.state,
      city: req.body.city,
      zip: req.body.zip,
      query: req.body.query,
    })
      .save()
      .then(() => {
        res.render("contactForm", {
          message: "From has been submited successfully",
        });
      })
      .catch((err) => {
        res.render("contactForm", {
          errorMessage: "Error submiting your form",
        });
        console.log("contactSubmit/userData: " + err.message);
      });

  } catch (error) {
    console.log("contactSubmit: " + error.message);
  }
};

module.exports = {
  loadHome,
  loadLogin,
  userRegistration,
  checkLogin,
  userLogout,
  userEdit,
  updateUserEdit,
  loadContact,
  contactSubmit,
  verifyEmail
};
