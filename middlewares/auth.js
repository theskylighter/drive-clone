const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  const token = req.cookies.token;

//   token hai ya nahi
  if (!token) {
    return res.status(401).send("Access Denied /unauthorized");
  }

//   token tempered toh nhih hua?
  try {
    // abstracting BACK, info from the cookie
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // taki hume is userID ko fileSchema me save karne me asani ho
    
    req.user = decoded; 
    //Sets the user in req object, [to be used in the next callback function] in the route('/upload')
    // in index.routes.js
    
    return next();


  } catch (err) {
    return res.status(400).send("Invalid Token");
  }
}

module.exports = auth;