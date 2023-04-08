const isLogin = (req, res) => {
  try {
    if (req.session.user_id) {
    } else {
      res.redirect("/");
    }
  } catch (error) {
    console.log("islogout: ", error.message);
  }
};
const isLogout = (req, res) => {
  try {
    if (req.session.user_id) {
      res.redirect("/");
    }
  } catch (error) {
    console.log("islogin: ", error.message);
  }
};

module.exports = {
  isLogin,
  isLogout,
};
