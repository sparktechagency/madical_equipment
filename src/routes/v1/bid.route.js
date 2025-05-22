const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/auth');
const { AddBid, AllBid, SingleBid, DeleteBid, SelfBid } = require('../../controllers/bid.controller');

router.post('/add', auth('user'), AddBid);
router.get('/all/:id', auth('sellerAdmin'), AllBid);
router.get('/self', auth('user'), SelfBid);
router.get('/single/:id', auth('common'), SingleBid);
router.delete('/delete/:id', auth('common'), DeleteBid);

module.exports = router;
