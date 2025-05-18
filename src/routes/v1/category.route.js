const express = require('express');
const auth = require('../../middlewares/auth');
const categoryController = require('../../controllers/category.controller');

const router = express.Router();

router
  .route('/')
  .post(
    auth('admin'), // only admin allowed
    categoryController.CreateCategory
  )
  .get(
    auth('common'),
    categoryController.GetAllCategories
  );

router
  .route('/:id')
  .patch(
    auth('admin'),
    categoryController.UpdateCategoryName
  )
  .delete(
    auth('admin'),
    categoryController.DeleteCategory
  );

module.exports = router;
