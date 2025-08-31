const express = require("express")
const { CreateReport, GetAllReport, GetSingleReport, DeleteReport } = require("../../controllers/report.controller")
const auth = require("../../middlewares/auth");

const router = express.Router()

router.post('/create/:id', auth('common'), CreateReport)
router.get('/all', auth('commonAdmin'), GetAllReport)
router.get('/single/:id', auth('commonAdmin'), GetSingleReport)
router.delete('/:id', auth('commonAdmin'), DeleteReport)

module.exports = router