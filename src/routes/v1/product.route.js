// const express = require("express");
// const auth = require("../../middlewares/auth");
// const validate = require("../../middlewares/validate");
// const userFileUploadMiddleware = require("../../middlewares/fileUpload");
// const { createProductValidation } = require("../../validations/product.validation");
// const { CreateProduct } = require("../../controllers/product.controller");
// const UPLOADS_FOLDER_USERS = "./public/uploads/products";

// const uploadUsers = userFileUploadMiddleware(UPLOADS_FOLDER_USERS);

// const router = express.Router();

//   router.post('/create', auth('sellerAdmin'), [uploadUsers.fields([{name:"image", maxCount:4}])],validate(createProductValidation), CreateProduct
// )

// module.exports = router;

const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const userFileUploadMiddleware = require('../../middlewares/fileUpload');
const productValidation = require('../../validations/product.validation');
const productController = require('../../controllers/product.controller');

const UPLOADS_FOLDER = './public/uploads/products';
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
  '/:id/approve',
  auth('admin'),
  productController.approveProduct
);

router.patch(
  '/:id/decline',
  auth('admin'),
  productController.declineProduct
);

router.get(
  '/all',
  auth('common'),
  productController.AllProducts
);


router.get(
  '/self',
  auth('common'),
  productController.MyProducts
);

router.get(
  '/single/:id',
  auth('common'),
  productController.SingleProduct
);

module.exports = router;
