const httpStatus = require('http-status');
const { Product, Bid } = require('../models');
const ApiError = require('../utils/ApiError');
const { findCategoryByID } = require('./category.service');
const {ObjectId} = require('mongoose').Types

const createProduct = async (payload) => {
   const category =await findCategoryByID(payload?.category)
   if(!category) throw new ApiError(httpStatus.NOT_FOUND, "provide valid category !")
  return await Product.create(payload);
};

const getProductById = async (id) => {
  return await Product.findById(id);
};

const getSingleProductById = async (id) => {
  return await Product.findById(id).populate('author', "name address").populate('category')
};
// all products
const allProducts = async ( payload, isDeleted=false) => {
    const filter = {
        isDeleted,
        status :"approve"
    }
    // all 
    if (payload?.category) filter.category = new ObjectId(payload?.category)
    if (payload.status==="pending") filter.status = payload?.status
    if (payload?.role==='admin' && filter.status) filter.status = filter.status
    // query data 
    return await Product.find(filter).populate('author', "name address").populate('category').sort({createdAt:-1}).select('-createdAt -updatedAt -isDeleted');
};

// self product 
const myProducts = async (author, payload, isDeleted=false) => {
    const filter = {
        isDeleted,
        author: new ObjectId(author)
    }
    // all 
    if (payload?.category) filter.category = new ObjectId(payload?.category)
    if (payload.status) filter.status = payload?.status
    // query data 
    return await Product.find(filter).populate('author', "name address").populate('category').sort({createdAt:-1}).select('-createdAt -updatedAt -isDeleted');
};

const updateProduct = async (id, updateData) => {
  return await Product.findByIdAndUpdate(id, updateData, { new: true });
};

const softDeleteProduct = async (id) => {
  return await Product.findByIdAndUpdate(id, { isDeleted: true });
};

const selectWinner = async()=>{
  const products = await Product.find({
    status: "approve",
    isDeleted: false,
    date: { $lte: new Date() },
  });
  if (products.length > 0) {
    for (const product of products) {
      const bid = await Bid.findOne({ product: product._id, isDeleted: false }).sort({ bidAmount: -1 });
      if (bid) {
        bid.isWinner = true;
        bid.status = "payment";
        await bid.save();

        product.status = "sold";
        await product.save();
      }
    }
  }
}

module.exports = {
  createProduct,
  getProductById,
  getSingleProductById,
  allProducts,
  myProducts,
  updateProduct,
  softDeleteProduct,
  selectWinner
};


// demo data 
const medicalProduct = [
    {
      "category": "6829ab49aef739831d6d2641",
      "title": "Portable ECG Monitor",
      "price": 299.99,
      "description": "Handheld ECG device for continuous cardiac monitoring and easy data transfer."
    },
    {
      "category": "6829ab49aef739831d6d2643",
      "title": "N95 Respirator Mask",
      "price": 15.0,
      "description": "High-filtration mask designed to protect against airborne particles and pathogens."
    },
    {
      "category": "6829ab49aef739831d6d2642",
      "title": "Surgical Scalpel Set",
      "price": 79.5,
      "description": "Sterile stainless steel surgical scalpels for precise incisions in various surgeries."
    },
    {
      "category": "6829ab49aef739831d6d2644",
      "title": "Disposable Syringes 5ml",
      "price": 10.0,
      "description": "Pack of 100 sterile disposable syringes for injections and medical procedures."
    },
    {
      "category": "6829ab49aef739831d6d2646",
      "title": "Digital Blood Pressure Monitor",
      "price": 49.99,
      "description": "A compact and easy-to-use device for accurate blood pressure measurements at home or clinic."
    },
    {
      "category": "6829ab49aef739831d6d2645",
      "title": "Paracetamol Tablets 500mg",
      "price": 5.99,
      "description": "Effective pain relief and fever reducer, suitable for adults and children."
    },
    {
      "category": "6829ab49aef739831d6d2647",
      "title": "X-Ray Protective Lead Apron",
      "price": 150.0,
      "description": "Lead apron to protect patients and medical personnel during X-ray procedures."
    },
    {
      "category": "6829ab49aef739831d6d2648",
      "title": "Wound Dressing Kit",
      "price": 25.0,
      "description": "Complete kit for wound cleaning, dressing, and infection prevention."
    },
    {
      "category": "6829ab49aef739831d6d2649",
      "title": "Oxygen Concentrator",
      "price": 1200.0,
      "description": "Reliable device to supply concentrated oxygen for patients with respiratory issues."
    },
    {
      "category": "6829ab49aef739831d6d264a",
      "title": "Orthopedic Knee Brace",
      "price": 45.5,
      "description": "Adjustable knee brace providing support and pain relief for knee injuries."
    }
  ]
  
