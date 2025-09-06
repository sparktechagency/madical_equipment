const httpStatus = require("http-status");
const { Product, Bid, User } = require("../models");
const ApiError = require("../utils/ApiError");
const { findCategoryByID } = require("./category.service");
const { ObjectId } = require("mongoose").Types;

//create product
const createProduct = async (payload) => {
  const category = await findCategoryByID(payload?.category);
  if (!category)
    throw new ApiError(httpStatus.NOT_FOUND, "provide valid category !");
  return await Product.create(payload);
};

//product find with id
const getProductById = async (id) => {
  return await Product.findById(id);
};

// single product by id
const getSingleProductById = async (id) => {
  return await Product.findById(id)
    .populate("author", "name address image")
    .populate("category");
};

// all products
const allProducts = async (payload, isDeleted = false, role) => {
  // filter
  const filter = {
    isDeleted,
    status: "approve",
  };

  // all
  if (payload?.category) filter.category = new ObjectId(payload?.category);
  if (payload?.title) filter.title = { $regex: payload.title, $options: "i" };
  if (payload?.status === "pending") filter.status = payload?.status;
  if (role && role === "admin" && filter.status) filter.status = payload.status;
  const sortPrice = parseInt(payload?.sortPrice);

  //sort
  const sort = {};
  sortPrice ? (sort.price = sortPrice) : (sort.createdAt = -1);


  // query data
  const res = await Product.find(filter)
    .populate("author", "name address")
    .populate("category")
    .sort(sort)
    .select(" -createdAt -updatedAt -isDeleted");
  return res;
};


// self product
const myProducts = async (author, payload, isDeleted = false) => {
  const filter = {
    isDeleted,
    author: new ObjectId(author),
  };
  // all
  if (payload?.category) filter.category = new ObjectId(payload?.category);
  if (payload.status) filter.status = payload?.status;
  // query data
  return await Product.find(filter)
    .populate("author", "name address")
    .populate("category", "-createdAt -updatedAt -isDeleted")
    .sort({ createdAt: -1 })
    .select("-createdAt -updatedAt -isDeleted");
};

// self product
const sellerProducts = async (author, payload, isDeleted = false) => {
  const seller = await User.findById(author).select(
    "name email image phone role address currentBalance totalIncome"
  );
  const filter = {
    isDeleted,
    author: new ObjectId(author),
  };
  // all
  if (payload?.category) filter.category = new ObjectId(payload?.category);
  if (payload.status) filter.status = payload?.status;
  // query data
  const products = await Product.find(filter)
    .populate("category", "-createdAt -updatedAt -isDeleted ")
    .sort({ createdAt: -1 })
    .select("-createdAt -updatedAt -isDeleted -author");
  return {
    author: seller,
    products,
  };
};

//update product
const updateProduct = async (id, updateData) => {
  return await Product.findByIdAndUpdate(id, updateData, { new: true });
};

//update product
const topPikedProduct = async () => {
  const products = await Bid.aggregate([
    {
      $match: {
        status: { $in: ["pending", "progress"] },
      },
    },
    {
      $group: {
        _id: "$product",
        totalBid: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "productDetails",
      },
    },
    {
      $unwind: {
        path: "$productDetails",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "productDetails.author",
        foreignField: "_id",
        as: "author",
      },
    },
    {
      $unwind: {
        path: "$author",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        _id: 1,
        totalBid: 1,
        title: "$productDetails.title",
        price: "$productDetails.price",
        description: "$productDetails.description",
        images: "$productDetails.images",
        date: "$productDetails.date",
        status: "$productDetails.status",
        "author._id": 1,
        "author.address": 1,
        // "author.phone": 1,
      },
    },
  ]);

  return products;
};

//delete product
const softDeleteProduct = async (id) => {
  return await Product.findByIdAndUpdate(id, { isDeleted: true });
};

//select product
const selectWinner = async () => {
  const products = await Product.find({
    status: "approve",
    isDeleted: false,
    date: { $lte: new Date() },
  });
  if (products.length > 0) {
    for (const product of products) {
      const bid = await Bid.findOne({
        product: product._id,
        isDeleted: false,
      }).sort({ bidAmount: -1 });
      if (bid) {
        bid.isWinner = true;
        bid.paymentStatus = "unpaid";
        await bid.save();

        // product.status = "sold";
        // await product.save();
      }
    }
  }
};

// export all service
module.exports = {
  createProduct,
  getProductById,
  getSingleProductById,
  allProducts,
  topPikedProduct,
  myProducts,
  sellerProducts,
  updateProduct,
  softDeleteProduct,
  selectWinner,
};
