const httpStatus = require('http-status');
const { Product, Bid, User } = require('../models');
const ApiError = require('../utils/ApiError');
const { findCategoryByID } = require('./category.service');
const {ObjectId} = require('mongoose').Types

//create product
const createProduct = async (payload) => {
   const category =await findCategoryByID(payload?.category)
   if(!category) throw new ApiError(httpStatus.NOT_FOUND, "provide valid category !")
  return await Product.create(payload);
};

//product find with id
const getProductById = async (id) => {
  return await Product.findById(id);
};

// single product by id 
const getSingleProductById = async (id) => {
  return await Product.findById(id).populate('author', "name address image").populate('category')
};

// all products
const allProducts = async ( payload, isDeleted=false, role) => {

  // filter
    const filter = {
        isDeleted,
        status :"approve"
    }

    // all 
    if (payload?.category) filter.category = new ObjectId(payload?.category)
    if (payload?.title)  filter.title = { $regex: payload.title, $options: "i" }; 
    if (payload.status==="pending") filter.status = payload?.status
    if (role==='admin' && filter.status) filter.status = payload.status
    const sortprice = parseInt(payload.sortprice) || -1

    //sort 
    const  sort = {}
    sortprice ? sort.price = sortprice : sort.createdAt = -1

    // query data 
    return await Product.find(filter).populate('author', "name address").populate('category').sort(sort).select('-createdAt -updatedAt -isDeleted');

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
    return await Product.find(filter).populate('author', "name address").populate('category', '-createdAt -updatedAt -isDeleted').sort({createdAt:-1}).select('-createdAt -updatedAt -isDeleted');
};

// self product 
const sellerProducts = async (author, payload, isDeleted=false) => {
  const seller = await User.findById(author).select('name email image phone role address currentBalance totalIncome')
  const filter = {
        isDeleted,
        author: new ObjectId(author)
    }
    // all 
    if (payload?.category) filter.category = new ObjectId(payload?.category)
    if (payload.status) filter.status = payload?.status
    // query data 
    const products = await Product.find(filter).populate('category', '-createdAt -updatedAt -isDeleted ').sort({createdAt:-1}).select('-createdAt -updatedAt -isDeleted -author');
    return {
      author : seller,
      products
    }
};

//update product
const updateProduct = async (id, updateData) => {
  return await Product.findByIdAndUpdate(id, updateData, { new: true });
};

//update product
const topPikedProduct = async () => {
  const products = await Bid.aggregate([
    {
      $match : {
        status :{$in:["pending","progress"]}
      }
    },
    {
      $group : {
        _id:'$product',
        totalBid : {$sum:1} 
      }
    }, 
    {
      $lookup: {
        from: 'products', 
        localField: '_id',
        foreignField: '_id',
        as: 'productDetails'
      }
    },
    {
      $unwind: {
        path: '$productDetails',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $lookup: {
        from: 'users', 
        localField: 'productDetails.author',
        foreignField: '_id',
        as: 'author'
      }
    },
    {
      $unwind: {
        path: '$author',
        preserveNullAndEmptyArrays: true
      }
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
      }
    }
  ])

  return products
 };
 
//delete product
const softDeleteProduct = async (id) => {
  return await Product.findByIdAndUpdate(id, { isDeleted: true });
};

//select product
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
        bid.paymentStatus="unpaid"
        await bid.save();

        // product.status = "sold";
        // await product.save();
      }
    }
  }
}

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
  selectWinner
};


// // demo data 
// const medicalProduct = [
//     {
//       "category": "6829ab49aef739831d6d2641",
//       "title": "Portable ECG Monitor",
//       "price": 299.99,
//       "description": "Handheld ECG device for continuous cardiac monitoring and easy data transfer."
//     },
//     {
//       "category": "6829ab49aef739831d6d2643",
//       "title": "N95 Respirator Mask",
//       "price": 15.0,
//       "description": "High-filtration mask designed to protect against airborne particles and pathogens."
//     },
//     {
//       "category": "6829ab49aef739831d6d2642",
//       "title": "Surgical Scalpel Set",
//       "price": 79.5,
//       "description": "Sterile stainless steel surgical scalpels for precise incisions in various surgeries."
//     },
//     {
//       "category": "6829ab49aef739831d6d2644",
//       "title": "Disposable Syringes 5ml",
//       "price": 10.0,
//       "description": "Pack of 100 sterile disposable syringes for injections and medical procedures."
//     },
//     {
//       "category": "6829ab49aef739831d6d2646",
//       "title": "Digital Blood Pressure Monitor",
//       "price": 49.99,
//       "description": "A compact and easy-to-use device for accurate blood pressure measurements at home or clinic."
//     },
//     {
//       "category": "6829ab49aef739831d6d2645",
//       "title": "Paracetamol Tablets 500mg",
//       "price": 5.99,
//       "description": "Effective pain relief and fever reducer, suitable for adults and children."
//     },
//     {
//       "category": "6829ab49aef739831d6d2647",
//       "title": "X-Ray Protective Lead Apron",
//       "price": 150.0,
//       "description": "Lead apron to protect patients and medical personnel during X-ray procedures."
//     },
//     {
//       "category": "6829ab49aef739831d6d2648",
//       "title": "Wound Dressing Kit",
//       "price": 25.0,
//       "description": "Complete kit for wound cleaning, dressing, and infection prevention."
//     },
//     {
//       "category": "6829ab49aef739831d6d2649",
//       "title": "Oxygen Concentrator",
//       "price": 1200.0,
//       "description": "Reliable device to supply concentrated oxygen for patients with respiratory issues."
//     },
//     {
//       "category": "6829ab49aef739831d6d264a",
//       "title": "Orthopedic Knee Brace",
//       "price": 45.5,
//       "description": "Adjustable knee brace providing support and pain relief for knee injuries."
//     }
//   ]
  
//   const images = ['uploads/products/monitor-1747563990527.png', 'uploads/products/oxygen_concentrator-1747563990935.png',
//     'uploads/products/oxygenconcentrator-1747563991324.png',
//     'uploads/products/surgical_scalpel_set-1747563991647.png'
//   ]






// const data = [
//   {
//     "author": "685bd62ba9bf9724ef7f1137",
//     "product": "6829b7d9e12d592927a7524c",
//     "bidAmount": 35,
//     "status": "pending",
//     "isDeleted": false,
//     "paymentStatus": "unpaid"
//   },
//   {
//     "author": "6829661e890e92b269062e22",
//     "product": "6829b5d8e12d592927a7525a",
//     "bidAmount": 35,
//     "status": "pending",
//     "isDeleted": false,
//     "paymentStatus": "unpaid"
//   },
//   {
//     "author": "685bd62ba9bf9724ef7f1137",
//     "product": "6829b5d8e12d592927a7525a",
//     "bidAmount": 35,
//     "status": "pending",
//     "isDeleted": false,
//     "paymentStatus": "unpaid"
//   },
//   {
//     "author": "685bc2eaa9bf9724ef7f1114",
//     "product": "6829b5d8e12d592927a7525a",
//     "bidAmount": 35,
//     "status": "pending",
//     "isDeleted": false,
//     "paymentStatus": "unpaid"
//   },
//   {
//     "author": "685bbd62a9bf9724ef7f110f",
//     "product": "6829b5d8e12d592927a7525a",
//     "bidAmount": 35,
//     "status": "pending",
//     "isDeleted": false,
//     "paymentStatus": "unpaid"
//   },
//   {
//     "author": "685bbd62a9bf9724ef7f110f",
//     "product": "6829bcd9e12d592927a75251",
//     "bidAmount": 35,
//     "status": "pending",
//     "isDeleted": false,
//     "paymentStatus": "unpaid"
//   },
//   {
//     "author": "685bbd62a9bf9724ef7f110f",
//     "product": "6842871c3e36a7ef8de90fff",
//     "bidAmount": 35,
//     "status": "pending",
//     "isDeleted": false,
//     "paymentStatus": "unpaid"
//   }
// ]


  //  const updateAllProduct = async()=>{
  //   const res = await Bid.create(data)
  //     console.log(res);
  //   }
  //   updateAllProduct()