const express = require("express");
const validate = require('../../middlewares/validate');
const {
  CreatePayout,
  GetAllPayouts,
  GetSinglePayout,
  UpdatePayoutStatus,
} = require("../../controllers/payout.controller");

const auth = require("../../middlewares/auth");
const { createPayoutValidation } = require("../../validations/payout.validation");
const convertHeicToPngMiddleware = require("../../middlewares/converter");
const UPLOADS_FOLDER_USERS = "./public/uploads/payment";
const userFileUploadMiddleware = require("../../middlewares/fileUpload");

const uploadUsers = userFileUploadMiddleware(UPLOADS_FOLDER_USERS);

const router = express.Router();

// Seller creates payout request
router.post("/create", validate(createPayoutValidation), auth('seller'),  CreatePayout);

// Admin gets all payout requests
router.get("/all", auth("admin"), GetAllPayouts);

// Admin gets single payout by id
router.post("/single", auth("admin"), GetSinglePayout);

// Admin approves or declines payout
router.post("/status/:id",
   auth("admin"),
   [uploadUsers.single("image")],
   convertHeicToPngMiddleware(UPLOADS_FOLDER_USERS),
    UpdatePayoutStatus);

module.exports = router;
