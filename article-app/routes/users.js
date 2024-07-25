var express = require("express");
var router = express.Router();
var User = require("../models/User");

// Render user list
router.get("/", (req, res, next) => {
  res.render("users");
});

// Render registration form
router.get("/register", (req, res, next) => {
  res.render("registrationForm");
});

// Handle registration
router.post("/register", (req, res, next) => {
  User.create(req.body)
    .then(() => {
      res.redirect("/users/login");
    })
    .catch((err) => {
      return next(err);
    });
});

// Render login form
router.get("/login", (req, res, next) => {
  var error = req.flash("error")[0];
  res.render("loginForm", { error });
});

// Handle login
router.post("/login", (req, res, next) => {
  var { email, password } = req.body;
  if (!email || !password) {
    req.flash("error", "Email/password Required");
    return res.redirect("/users/login");
  }

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        req.flash("error", "User Not Found");
        return res.redirect("/users/login");
      }

      user.verifyPassword(password, (err, result) => {
        if (err) return next(err);
        if (!result) {
          req.flash("error", "Password incorrect");
          return res.redirect("/users/login");
        }

        req.session.userId = user.id;
        res.redirect("/users/dashboard");
      });
    })
    .catch((err) => {
      console.error("Error finding user:", err);
      return next(err);
    });
});

// Render dashboard
router.get("/dashboard", (req, res, next) => {
  User.findById(req.session.userId)
    .then((user) => {
      if (!user) {
        return res.redirect("/users/login");
      }
      res.render("dashboard", { user });
    })
    .catch((err) => {
      return next(err);
    });
});

// Handle logout
router.get("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      return next(err);
    }
    res.clearCookie("connect.sid");
    res.redirect("/users/login");
  });
});

// Export router
module.exports = router;
