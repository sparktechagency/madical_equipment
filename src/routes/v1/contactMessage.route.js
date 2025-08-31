const express = require("express");
const validate = require('../../middlewares/validate');
const {
  CreateContactMessage,
  GetAllContactMessages,
  GetSingleContactMessage,
  MarkContactMessageRead,
  DeleteContactMessage,
} = require("../../controllers/contactMessage.controller");
const auth = require("../../middlewares/auth");
const { createContactMessageValidation } = require("../../validations/user.validation");

const router = express.Router();

// User can post message
router.post("/create",  
    validate(createContactMessageValidation),
CreateContactMessage);

// Admin routes
router.get("/all", auth("commonAdmin"), GetAllContactMessages);
router.get("/single/:id", auth("commonAdmin"), GetSingleContactMessage);
router.patch("/read/:id", auth("commonAdmin"), MarkContactMessageRead);
router.delete("/delete/:id", auth("commonAdmin"), DeleteContactMessage);

module.exports = router;
