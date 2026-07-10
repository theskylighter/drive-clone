// it was okay to use user.routes for non-user-specific routes, but it is a good practice to use index.routes

// we generally use index.routes for the routes that are not user specific.
const express = require("express");
const router = express.Router();
const upload = require("../config/multer.config");
const fileModel = require("../models/files.model");
const authMiddleware = require("../middlewares/auth");

router.get("/", (req, res) => {
  res.redirect("/user/login");
});

router.get("/home", authMiddleware, async (req, res) => {
  try {
    const userFiles = await fileModel.find({ user: req.user.userId });
    console.log(userFiles);

    res.render("home", { 
      files: userFiles, 
      user: req.user,
      isDemoMode: process.env.DEMO_MODE === 'true'
    });
  } catch (err) {
    res.status(500).json({
      message: "Server Error",
    });
  }
});


router.post(
  "/upload",
  authMiddleware,
  async (req, res, next) => {
    if (process.env.DEMO_MODE === 'true') {
      try {
        const userFilesCount = await fileModel.countDocuments({ user: req.user.userId });
        if (userFilesCount >= 5) {
          return res.status(400).send("Upload limit reached (max 5 files in demo mode). Please wait for files to expire (24 hours).");
        }
      } catch (err) {
        return res.status(500).send("Server error checking file count.");
      }
    }
    next();
  },
  (req, res, next) => {
    upload.single("file")(req, res, (err) => {
      if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          const limit = process.env.DEMO_MODE === 'true' ? '100 KB' : '1 MB';
          return res.status(400).send(`File size exceeds limit of ${limit}`);
        }
        return res.status(400).send(err.message || 'File upload failed');
      }
      next();
    });
  },
  async (req, res) => {
    if (!req.file) {
      return res.status(400).send("No file uploaded or file upload failed");
    }
    const newfile = await fileModel.create({
      // fill the req.file metadata into the fileSchema
      path: req.file.path,
      originalname: req.file.originalname,

      // userID?? here you go
      // the req.user has been filled in the auth `middleware`
      user: req.user.userId,
      // So, now just need to access the `userId` from it
    });
    res.redirect("/home");
  },
);

router.get("/download/:path", authMiddleware, async (req, res) => {
  const loggedInUserId = req.user.userId;

  console.log(req.user.userId);
  console.log(req.params);
  const path = req.params.path;

  const file = await fileModel.findOne({
    user: loggedInUserId,
    path: path,
  });
  console.log(file);

  if (!file) {
    return res.status(404).send("file not found");
  }

  // to download anything from the firebas, we need to have a signed URL using valid credentials
  // hence we need to require the firebase config file
  const firebaseConfig = require("../config/firebase.config");
  // res.download(file.path);

  const signedUrl = await firebaseConfig
    .storage()
    .bucket()
    .file(path)
    .getSignedUrl({
      action: "read",
      expires: Date.now() + 15 * 60 * 1000, //15 minutes
      responseDisposition: `attachment; filename="${file.originalname}"`,
    });
  res.redirect(signedUrl[0]);
});

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/user/login"); // or wherever your login route is
});

module.exports = router;
