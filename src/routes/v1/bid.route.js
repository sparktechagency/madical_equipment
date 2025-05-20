const express = require('express');
const router = express.Router();
const { AddBid, AllBid, SingleBid, DeleteBid } = require('../controllers/bid.controller');
const auth = require('../../middlewares/auth');

router.post('/bid', auth('user'), AddBid);
router.get('/bids', auth('adminSeller'), AllBid);
router.get('/bid/:id', auth('common'), SingleBid);
router.delete('/bid/:id', auth('common'), DeleteBid);

module.exports = router;
