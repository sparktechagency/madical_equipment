const express  = require("express")
const { handleStripeWebhook, CreatePayment, GetSellerEarnings, GetSingleTransaction, GetAllProductPayments } = require("../../controllers/payment.controller")
const bodyParser = require("body-parser")
const auth = require("../../middlewares/auth")
const router = express.Router()

router.post('/create_checkout_session/:id', auth('common'), CreatePayment)
router.post('/webhook',   bodyParser.raw({ type: "application/json" }),  handleStripeWebhook )

router.get('/seller_earnings', auth('seller'), GetSellerEarnings)
router.get('/product_transactions', auth('admin'), GetAllProductPayments)
router.get('/transaction/:id', auth('common'), GetSingleTransaction)

module.exports = router