const express = require("express");
const validate = require('../../middlewares/validate');
const {
  CreatePayout,
  GetAllPayouts,
  GetSinglePayout,
  UpdatePayoutStatus,
  SellerSelfPayoutHistory,
} = require("../../controllers/payout.controller");

const auth = require("../../middlewares/auth");
const { createPayoutValidation } = require("../../validations/payout.validation");
const UPLOADS_FOLDER_USERS = "payment";
// const UPLOADS_FOLDER_USERS = "./public/uploads/payment";
const userFileUploadMiddleware = require("../../middlewares/fileUploader");
// const userFileUploadMiddleware = require("../../middlewares/fileUpload");

const uploadUsers = userFileUploadMiddleware(UPLOADS_FOLDER_USERS);

const router = express.Router();

// Seller creates payout request
router.post("/create", validate(createPayoutValidation), auth('seller'),  CreatePayout);

// Admin gets all payout requests
router.get("/all", auth("commonAdmin"), GetAllPayouts);
// seller gets all payout requests
router.get("/self", auth("seller"), SellerSelfPayoutHistory);

// Admin gets single payout by id
router.post("/single", auth("commonAdmin"), GetSinglePayout);

// Admin approves or declines payout
router.post("/status/:id",
   auth("commonAdmin"),
   [uploadUsers.single("image")],
  //  convertHeicToPngMiddleware(UPLOADS_FOLDER_USERS),
    UpdatePayoutStatus);

module.exports = router;
