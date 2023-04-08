const isLogin = async (req, res, next) => {
  try {
    if (req.session.admin_id) {
    } else {
      res.redirect("/admin/");
    }
    next()
  } catch (error) {
    console.log("isLogin:  " + error.message);
  }
};

const isLogout = (req, res, next) => {
  try {
    if (req.session.admin_id) {
      res.redirect("/admin/home");
    }
    
    next()
    
  } catch (error) {
    console.log("isLogout: " + error.message);
  }

};

module.exports = {
  isLogin,
  isLogout,
};
