const express = require("express");
const auth = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const userValidation = require("../../validations/user.validation");
const userController = require("../../controllers/user.controller");
const userFileUploadMiddleware = require("../../middlewares/fileUploader");
// const userFileUploadMiddleware = require("../../middlewares/fileUpload");
// const UPLOADS_FOLDER_USERS = "./public/uploads/users";
const UPLOADS_FOLDER_USERS = "users";

const uploadUsers = userFileUploadMiddleware(UPLOADS_FOLDER_USERS);

const router = express.Router();

router.route("/self/in").get(auth("common"), userController.getProfile);

router
  .route("/self/update")
  .patch(
    auth("common"),
    validate(userValidation.updateUser),
    [uploadUsers.single("image")],
    // convertHeicToPngMiddleware(UPLOADS_FOLDER_USERS),
    userController.updateProfile
  );

  router.get('/all', auth('commonAdmin'), userController.getUsers)

  

module.exports = router;
