const express = require("express");
const auth = require("../../middlewares/auth");
const categoryController = require("../../controllers/category.controller");
const userFileUploadMiddleware = require("../../middlewares/fileUploader");
// const userFileUploadMiddleware = require("../../middlewares/fileUpload");

const UPLOADS_FOLDER_USERS = "category";
// const UPLOADS_FOLDER_USERS = "./public/uploads/category";

const uploadUsers = userFileUploadMiddleware(UPLOADS_FOLDER_USERS);

const router = express.Router();

router
  .route("/")
  .post(
    auth("commonAdmin"), // only admin allowed
    [uploadUsers.single("image")],
    // convertHeicToPngMiddleware(UPLOADS_FOLDER_USERS),
    categoryController.CreateCategory
  )
  .get(categoryController.GetAllCategories);

router.get(
  "/single/:id",
  auth("common"),
  categoryController.GetSingleCategories
);

router
  .route("/:id")
  .patch(
    auth("commonAdmin"),
    [uploadUsers.single("image")],
    // convertHeicToPngMiddleware(UPLOADS_FOLDER_USERS),
    categoryController.UpdateCategoryName
  )
  .delete(auth("commonAdmin"), categoryController.DeleteCategory);

module.exports = router;
