const express = require("express")
const auth = require("../../middlewares/auth");
const { SellerDashboardStatistics, SellerRecentSelling, GetSellerIncomeLast12Months, AdminDashboardStatistics, AllTransactionRation } = require("../../controllers/dashboard.controller");

const router = express.Router()
//seller
router.get('/seller/statistics', auth('seller'), SellerDashboardStatistics)
router.get('/seller/recent_sell', auth('seller'), SellerRecentSelling)
router.get('/seller/income_ratio', auth('seller'), GetSellerIncomeLast12Months)
//admin
router.get('/admin/statistics', auth('commonAdmin'), AdminDashboardStatistics)
router.get('/admin/recent_sell', auth('commonAdmin'), SellerRecentSelling)
router.get('/admin/transaction_ratio', auth('commonAdmin'), AllTransactionRation)

module.exports = router