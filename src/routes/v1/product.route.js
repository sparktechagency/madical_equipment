const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const userFileUploadMiddleware = require('../../middlewares/fileUploader');
// const userFileUploadMiddleware = require('../../middlewares/fileUpload');
const productValidation = require('../../validations/product.validation');
const productController = require('../../controllers/product.controller');

const UPLOADS_FOLDER = 'products';
// const UPLOADS_FOLDER = './public/uploads/products';
const upload = userFileUploadMiddleware(UPLOADS_FOLDER);

const router = express.Router();

router.post(
  '/',
  auth('sellerAdmin'),
  upload.fields([{ name: 'image', maxCount: 4 }]),
  validate(productValidation.createProductValidation),
  productController.createProduct
);

router.patch(
  '/:id',
  auth('sellerAdmin'),
  upload.fields([{ name: 'image', maxCount: 4 }]),
  validate(productValidation.updateProductValidation),
  productController.updateProduct
);

router.delete(
  '/:id',
  auth('sellerAdmin'),
  productController.deleteProduct
);

router.patch(
  '/approve/:id',
  auth('commonAdmin'),
  productController.approveProduct
);

router.patch(
  '/decline/:id',
  auth('commonAdmin'),
  productController.declineProduct
);

router.get(
  '/all',
  productController.AllProducts
);

router.get(
  '/top_picked',
  productController.TopPikedProducts
);

router.get(
  '/self',
  auth('common'),
  productController.MyProducts
);

router.get(
  '/seller/:id',
  auth('common'),
  productController.SellerProducts
);

router.get(
  '/single/:id',
  // auth('common'), 
  productController.SingleProduct
);

router.get(
  '/request',
  // auth('common'),
  productController.ProductsRequest
);

module.exports = router;
