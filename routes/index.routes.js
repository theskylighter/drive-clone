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
  const userFiles = await fileModel.find({ user: req.user.userId });
  console.log(userFiles);

  res.render("home", { files: userFiles, user: req.user });
});
router.get("/home_sonnet", authMiddleware, async (req, res) => {
  const userFiles = await fileModel.find({ user: req.user.userId });
  console.log(userFiles);

  res.render("home_sonnet", { files: userFiles, user: req.user });
});

router.post(
  "/upload",
  authMiddleware,
  upload.single("file"),
  async (req, res) => {
    const newfile = await fileModel.create({
      // fill the req.file metadata into the fileSchema
      path: req.file.path,
      originalname: req.file.originalname,

      // userID?? here you go
      // the req.user has been filled in the auth `middleware`
      user: req.user.userId,
      // So, now just need to access the `userId` from it
    });
    res.send(req.file);
  }
);

router.get("/download/:path", authMiddleware, async (req, res) => {
  const loggedInUserId = req.user.userId;

  console.log(req.user.userId);
  console.log(req.params);
  const path = req.params.path;


  const file = await fileModel.findOne({
    user: loggedInUserId,
    path: path,
  })
  console.log(file);

  if (!file) {
    return res.status(404).send("file not found");
  }

  // to download anything from the firebas, we need to have a signed URL using valid credentials
  // hence we need to require the firebase config file
  const firebaseConfig = require("../config/firebase.config");
  // res.download(file.path);

  const signedUrl = await firebaseConfig.storage().bucket().file(path).getSignedUrl({
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
