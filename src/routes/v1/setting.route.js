const express = require("express");
const router = express.Router();
const auth = require("../../middlewares/auth");
const { GetPrivacy, UpsertPrivacy, GetAboutUs, UpsertAboutUs, GetTermsAndCondition, UpsertTermsAndCondition, GetSellerAgreement, UpsertSellerAgreement, GetUserAgreement, UpsertUserAgreement } = require("../../controllers/setting.controller");


// Privacy Policy
router.get("/privacy", GetPrivacy);
router.post("/privacy", auth("commonAdmin"), UpsertPrivacy);

// About Us
router.get("/about_us", GetAboutUs);
router.post("/about_us", auth("commonAdmin"), UpsertAboutUs);

// Terms & Conditions
router.get("/terms", GetTermsAndCondition);
router.post("/terms", auth("commonAdmin"), UpsertTermsAndCondition);

// Seller Agreement
router.get("/seller_agreement", GetSellerAgreement);
router.post("/seller_agreement", auth("commonAdmin"), UpsertSellerAgreement);

// User Agreement
router.get("/user_agreement", GetUserAgreement);
router.post("/user_agreement", auth("commonAdmin"), UpsertUserAgreement);

module.exports = router;
