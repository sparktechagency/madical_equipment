const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/auth');
const { AddBid, SingleBid, DeleteBid, SelfBid, ProductBid, AllBid,  ProductDelivery, ProductDeliveryCompleted, GetAllOrder, UserBid, GetSingleOrder } = require('../../controllers/bid.controller');

router.post('/add', auth('user'), AddBid);
router.get('/product/:id', auth('sellerAdmin'), ProductBid);
router.get('/all', auth('sellerAdmin'), AllBid);
router.get('/order', auth('sellerAdmin'), GetAllOrder);
router.get('/order/:id', auth('sellerAdmin'), GetSingleOrder);
router.get('/self', auth('user'), SelfBid);
router.get('/user/:id', auth('admin'), UserBid);
router.get('/single/:id', auth('common'), SingleBid);
router.delete('/delete/:id', auth('common'), DeleteBid);
router.post('/shipped/:id', auth('sellerAdmin'), ProductDelivery)
router.post('/delivery/:id', auth('sellerAdmin'), ProductDeliveryCompleted)

module.exports = router;