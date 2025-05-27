const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const { productService } = require('../services');
const response = require('../config/response');

// Create Product (seller)
const createProduct = catchAsync(async (req, res) => {
  const authorId = req.user.id;
  const {role} = req.user;

  const imagePaths = req.files?.image?.map(file => `uploads/products/${file.filename}`);
  if (!imagePaths || imagePaths.length !== 4) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Please provide exactly 4 images.');
  }

  const payload = {
    author: authorId,
    ...req.body,
    images: imagePaths,
  };
  if(role==="admin") payload.status="approve"

  const product = await productService.createProduct(payload);

  res.status(httpStatus.CREATED).json(
    response({
      message: 'Product created successfully',
      status: 'OK',
      statusCode: httpStatus.CREATED,
      data: product,
    })
  );
});

// Update Product (seller, own product)
const updateProduct = catchAsync(async (req, res) => {
  const productId = req.params.id;
  const userId = req.user.id;

  const product = await productService.getProductById(productId);
  if (!product) throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  if (product.author.toString() !== userId) throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized');

  // Update logic (include images if needed)
  const updateData = { ...req.body };
  if (req.files?.image) {
    const imagePaths = req.files.image.map(file => `uploads/products/${file.filename}`);
    if (imagePaths.length !== 4) throw new ApiError(httpStatus.BAD_REQUEST, 'Exactly 4 images required');
    updateData.images = imagePaths;
  }

  const updatedProduct = await productService.updateProduct(productId, updateData);

  res.status(httpStatus.OK).json(
    response({
      message: 'Product updated successfully',
      status: 'OK',
      statusCode: httpStatus.OK,
      data: updatedProduct,
    })
  );
});

// Soft delete product (seller, own product)
const deleteProduct = catchAsync(async (req, res) => {
  const productId = req.params.id;
  const userId = req.user.id;

  const product = await productService.getProductById(productId);
  if (!product) throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  if (product.author.toString() !== userId) throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized');

  await productService.softDeleteProduct(productId);

  res.status(httpStatus.OK).json(
    response({
      message: 'Product delete success',
      status: 'OK',
      statusCode: httpStatus.OK,
      data: {},
    })
  );
});

// Approve product (admin)
const approveProduct = catchAsync(async (req, res) => {
  const productId = req.params.id;

  const product = await productService.getProductById(productId);
  if (!product) throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');

  const updated = await productService.updateProduct(productId, { status: 'approve' });

  res.status(httpStatus.OK).json(
    response({
      message: 'Product approved',
      status: 'OK',
      statusCode: httpStatus.OK,
      data: updated,
    })
  );
});

// Decline product (admin)
const declineProduct = catchAsync(async (req, res) => {
  const productId = req.params.id;

  const product = await productService.getProductById(productId);
  if (!product) throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');

  const updated = await productService.updateProduct(productId, { status: 'declined' });

  res.status(httpStatus.OK).json(
    response({
      message: 'Product declined',
      status: 'OK',
      statusCode: httpStatus.OK,
      data: updated,
    })
  );
});

// single product 
const SingleProduct = catchAsync(async (req, res) => {
  const productId = req.params.id;

  const product = await productService.getSingleProductById(productId);
  if (!product || product.isDeleted) throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');

  res.status(httpStatus.OK).json(
    response({
      message: 'Product retrieved success',
      status: 'OK',
      statusCode: httpStatus.OK,
      data: product,
    })
  );
});

// All product 
const AllProducts = catchAsync(async (req, res) => {
    const {category} = req.query

  const products = await productService.allProducts({category});

  res.status(httpStatus.OK).json(
    response({
      message: 'Products retrieved success',
      status: 'OK',
      statusCode: httpStatus.OK,
      data: products,
    })
  );
});

// All product 
const MyProducts = catchAsync(async (req, res) => {
const {id:author} = req.user
const {category, status} = req.query

  const products = await productService.myProducts(author, {category, status});

  res.status(httpStatus.OK).json(
    response({
      message: 'Products retrieved success',
      status: 'OK',
      statusCode: httpStatus.OK,
      data: products,
    })
  );
});

// All product 
const SellerProducts = catchAsync(async (req, res) => {
const {id:author} = req.params
const {category, status} = req.query

  const products = await productService.myProducts(author, {category, status});

  res.status(httpStatus.OK).json(
    response({
      message: 'Products retrieved success',
      status: 'OK',
      statusCode: httpStatus.OK,
      data: products,
    })
  );
});

// requested product list
const ProductsRequest = catchAsync(async (req, res) => {

  const products = await productService.allProducts({status:"pending"});

  res.status(httpStatus.OK).json(
    response({
      message: 'pending Products retrieved success',
      status: 'OK',
      statusCode: httpStatus.OK,
      data: products,
    })
  );
});


module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  approveProduct,
  declineProduct,
  SingleProduct,
  AllProducts,
  MyProducts,
  ProductsRequest,
  SellerProducts
};
