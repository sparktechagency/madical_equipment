const express  = require("express")
const { handleStripeWebhook, CreatePayment } = require("../../controllers/payment.controller")
const bodyParser = require("body-parser")
const auth = require("../../middlewares/auth")
const router = express.Router()

router.post('/create_checkout_session/:id', auth('common'), CreatePayment)
router.post('/webhook',   bodyParser.raw({ type: "application/json" }),  handleStripeWebhook )

module.exports = router