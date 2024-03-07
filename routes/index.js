var express = require("express");
var router = express.Router();
const customerModel = require("./customers");
const merchantModel = require('./merchant');
const paymentModel = require('./payments')
const User = require('./merchantRequest')
const passport = require("passport");
const bodyParser = require('body-parser');
const localStrategy = require("passport-local");
const multer = require('multer')
const mongoose = require('mongoose');
const fs = require('fs').promises;

passport.use(new localStrategy(customerModel.authenticate()));
router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.static('public')); // Assuming your static files are in the 'public' directory

router.get("/", function (req, res) {
  res.render("index", { foooter: false })
});

router.get("/register", function (req, res) {
  res.render("Register", { footer: false });
});

router.get("/login", function (req, res) {
  res.render("login", { footer: false });
});

// Hard code a merchant during initialization
const hardCodedMerchant = new merchantModel({
  username: 'merchant',
  password: 'mer123',
  email: 'merchant@gmail.com',
});

// Save the hard-coded merchant to the database
hardCodedMerchant.save()
  .then(() => console.log('Hard-coded merchant saved'))
  .catch(err => console.error(err));

router.get('/merchant', (req, res) => {
  res.render('merchantPortal');
});

router.get("/customerPortal", isLoggedIn, async function (req, res) {
  const user = await customerModel.findOne({ username: req.session.passport.user });
  res.render("customerPortal", { footer: true, user});
});

router.get("/instantPayment", isLoggedIn, async function (req, res) {
  const user = await customerModel.findOne({ username: req.session.passport.user });
  res.render("instantPayment", { footer: true, user });
});

router.post("/instantPayment", async function(req, res, next) {
  try {
    // Create a new payment document with data from the form
    const paymentData = new paymentModel({
      username: req.body.inputUsername,
      email: req.body.inputAddress,
      accountNumber: req.body.inputAccountNumber,
      paymentAmount: req.body.inputPaymentAmount,
      bankName: req.body.inputBankName
    });

    const savedPaymentData = await paymentData.save();
    console.log('result= ', savedPaymentData);
// Show an alert in the browser
res.send('<script>alert("Congratulations! Payment done"); window.location.href = "/instantPayment";</script>');
  } catch (err) {
    console.log('Error in saving data:', err);
    res.status(500).send('Error in saving your data');
  }
});


router.get("/QR", isLoggedIn, async function (req, res) {
  const user = await customerModel.findOne({ username: req.session.passport.user });
  res.render("QR", { footer: true, user });
});

router.post("/register", function (req, res, next) {
  const userData = new customerModel({
    username: req.body.username,
    accountNumber: req.body.accountNumber,
    email: req.body.email
  });

  customerModel.register(userData, req.body.password)
    .then(function () {
      passport.authenticate("local")(req, res, function () {
        res.redirect("/customerPortal?message=AccountCreated");
      });
    });
});
// Route for the payment request page (accessible only to merchants)
router.get("/payments", function (req, res) {
  // Render the payment request page
  res.render("payments", { footer: true, user: req.user });
});
router.get("/customers", function (req, res) {
  // Render the payment request page
  res.render("customers", { footer: true, user: req.user });
});

router.get("/paymentRequest", function (req, res) {
  // Render the payment request page
  res.render("paymentRequest", { footer: true, user: req.user });
});


router.post("/login", function (req, res) {
  // Check if the logged-in user is the hardcoded merchant or not
  if (req.body.username === 'merchant' && req.body.password === 'mer123') {
    res.redirect('/merchant');
  } else {
    passport.authenticate("local", {
      failureRedirect: "/login"
    })(req, res, function () {
      res.redirect('/customerPortal');
    });
  }
});

router.post("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

function isLoggedIn(req, res, next) {

  if (req.isAuthenticated()) return next();
  res.redirect("/login")

}

// ------------------------------------------- 

// image upload
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, './uploads')
  },
  filename: function (req, file, cb) {
      cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  }
})

var upload = multer({
  storage: storage,

}).single("image")

// Insert user into DB
router.post("/paymentRequest", upload, async (req, res) => {

  try {
      const user = new User({
          customer: req.body.customer,
          email: req.body.email,
          phone: req.body.phone,
          payMethod: req.body.payMethod,
          image: req.file.filename,
      })

      await user.save()
          .then(() => {
              res.json({ message: err.message, type: 'danger' })
          })
  } catch (err) {
      req.session.message = {
          type: 'success',
          message: 'User added successfully!'
      }
      res.redirect('/payments')
  }

})


// Get all users route


router.get("/", async (req, res) => {
  try {
      const users = await User.find().exec();
      res.render('index', {
          title: 'Home Page',
          users: users,
      });
  } catch (err) {
      res.json({ message: err.message });
  }
});


router.get('/paymentRequest', (req, res) => {
  res.render('paymentRequest', { title: "Add Users" })
})


module.exports = router;