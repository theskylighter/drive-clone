const express = require("express");
const { body, validationResult } = require("express-validator");
const { isLength } = require("validator");
const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = express.Router();

// /user/test
// router.get('/test',(req,res)=>{
//     res.send('test route');
// })
router.get("/register", (req, res) => {
  res.render("register");
});
router.post(
    "/register",
    body("username").trim().isLength({ min: 3 }),
    body("name").trim().isLength({ min: 3 }),
    body("email").trim().isEmail().isLength({ min: 9 }),
    body("password").trim().isLength({ min: 5 }),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // res.send('invalid data');
            return res
            .status(400)
            .json({ errors: errors.array(), message: "invalid data" });
        }

        const { username, name, email, password } = req.body;
        console.log(req.body);
        // res.send("successful post register route");
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await userModel.create({
            username,
            name,
            email,
            password: hashedPassword,
        });
        
        // Redirect to login page instead of sending JSON
        res.redirect('/user/login');
    }
);

router.get("/login", (req, res) => {
  res.render("login");

});
router.post(
    "/login",
    body("username").trim().isLength({ min: 3 }),
    body("password").trim().isLength({ min: 5 }),
    async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ errors: errors.array(), message: "invalid data" });
    }
    const { username, password } = req.body;
    const user = await userModel.findOne({ username: username });
    if (!user) {
      return res
        .status(400)
        .json({ message: "username or password is incorrect" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "username or password is incorrect" });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        username: user.username,
      },
      process.env.JWT_SECRET,
    );

    res.cookie('token',token);

    console.log(req.body);
    res.redirect('/home');
  }
);

module.exports = router;
