const httpStatus = require('http-status');
const { categoryService } = require('../services');
const catchAsync = require('../utils/catchAsync');
const response = require('../config/response');
const ApiError = require('../utils/ApiError');

// Create a new category
const CreateCategory = catchAsync(async (req, res) => {
  const { name } = req.body;

  if(!req?.file) throw new ApiError(httpStatus.BAD_REQUEST, "please provide category image!")
    const image = 'uploads/category/'+req.file.filename

  const result = await categoryService.createCategory({ name, image });

  res.status(httpStatus.CREATED).json(
    response({
      message: 'Category created successfully',
      status: 'OK',
      statusCode: httpStatus.CREATED,
      data: result,
    })
  );
});

// Get all categories (not deleted)
const GetAllCategories = catchAsync(async (req, res) => {
  const categories = await categoryService.allCategory();

  res.status(httpStatus.OK).json(
    response({
      message: 'Categories retrieved successfully',
      status: 'OK',
      statusCode: httpStatus.OK,
      data: categories,
    })
  );
});

// Update category name by ID
const UpdateCategoryName = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  const payload = {name}

if(req.file) payload.image = 'uploads/category/'+req.file.filename

  await categoryService.updateCategory(id, payload);

  res.status(httpStatus.OK).json(
    response({
      message: 'Category updated successfully',
      status: 'OK',
      statusCode: httpStatus.OK,
      data: null,
    })
  );
});

// Soft delete category by ID
const DeleteCategory = catchAsync(async (req, res) => {
  const { id } = req.params;

  await categoryService.deleteCategory(id);

  res.status(httpStatus.OK).json(
    response({
      message: 'Category delete successfully',
      status: 'OK',
      statusCode: httpStatus.OK,
      data: null,
    })
  );
});

module.exports = {
  CreateCategory,
  GetAllCategories,
  UpdateCategoryName,
  DeleteCategory,
};
