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
  if (process.env.DEMO_MODE === 'true') {
    return res.redirect("/user/login");
  }

  const token = req.cookies.token;

//   token hai ya nahi
  if (!token) {
    res.render("register");
  }
  else {
    res.redirect("home")
  }
});
router.post(
    "/register",
    body("username").trim().isLength({ min: 3 }),
    body("name").trim().isLength({ min: 3 }),
    body("email").trim().isEmail().isLength({ min: 9 }),
    body("password").trim().isLength({ min: 5 }),
    async (req, res) => {
        if (process.env.DEMO_MODE === 'true') {
            return res.status(403).json({ message: "Registration is disabled in demo mode" });
        }
        
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
  const token = req.cookies.token;

//   token hai ya nahi
  if (!token) {
    res.render("login", { isDemoMode: process.env.DEMO_MODE === 'true' });
  }
  else {
    res.redirect("home")
  }

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

    // Demo Mode Guest Login Bypass
    if (process.env.DEMO_MODE === 'true' && username === 'guest' && password === 'guest123') {
      const token = jwt.sign(
        {
          userId: '000000000000000000000000',
          email: 'guest@cloud9.local',
          username: 'guest',
        },
        process.env.JWT_SECRET,
      );
      res.cookie('token', token);
      return res.redirect('/home');
    }

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
