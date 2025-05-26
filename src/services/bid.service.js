const httpStatus = require("http-status")
const { Bid } = require("../models")
const ApiError = require("../utils/ApiError")
const {ObjectId} = require("mongoose").Types

const bidPost = async(payload)=>{
    await Bid.create(payload)
}

const productBid = async(product, status)=>{
    const filter = {
        product: new ObjectId(product),
        isDeleted:false
    }
    if(status) filter.status= status
    console.log(filter);

    return await Bid.find(filter).sort({createdAt:-1}).select("-isDeleted -createdAt -updatedAt").populate('author', "name address").populate({
        path:'product',
        select:"-createdAt -updatedAt -isDeleted",
        populate:{path:"author",
            select:"name address",
        }
    })
}

const selfBid = async(user, status)=>{
    const filter ={author: new ObjectId(user)}
    if(status) filter.status = status
    
    return await Bid.find(filter).sort({createdAt:-1}).select("-isDeleted -createdAt -updatedAt").populate('author', "name address").populate({
        path:'product',
        select:"-createdAt -updatedAt -isDeleted",
        populate:{path:"author",
            select:"name address",
        }
    })
}

const getBidById = async(id)=>{
    return await Bid.findById(id).populate('author', "name address").populate({
        path:'product',
        select:"-createdAt -updatedAt",
        populate:{path:"author",
            select:"name address",
        }
    })
}

const deleteBidById = async(id)=>{
     await Bid.findByIdAndUpdate(id, {isDeleted:true})
    return {}
    }

const getAllBid = async (productHoner, role, status) =>{
    const filter = {isDeleted:false, isWinner:true}
    if(status)filter.status = status
    // if(!status)filter.status = {$nin:["pending", "cancelled"]}

    //pipeline for aggregation
    const pipeline = [
        { $match:filter},
        {
            $lookup:{
                from:"users",
                localField:"author",
                foreignField:"_id",
                as:"author",
            }
        },
        {
            $unwind:"$author"
        },
        {
            $lookup:{
                from:"products",
                localField:"product",
                foreignField:"_id",
                as:"product"
            }
        },{
            $unwind:"$product"
        },
       
       
    ]

    //filter by product author
    if(role==='seller') {
        pipeline.push({
            $match:{
                'product.author':new ObjectId(productHoner)
            }
        })
    }

    //format product bid data
    pipeline.push( {$project:{
        _id:1,
        'author.name':1,
        'author.email':1,
        'author.phone':1,
        'author.image':1,
        'product.title':1,
        'product.author':1,
        "product.category":1,
        "product.price":1,
        "product.description":1,
        'product.images':1,
        'bidAmount':1,
        'paymentStatus':1,
        'status':1,
        createdAt:1
    }
})
    //bid aggregation
    const bids = await Bid.aggregate(pipeline)
     return bids
}

const sendDelivery = async (bid)=>{
    return await Bid.findByIdAndUpdate(bid,{status:"shipped"}, {new:true})
}

const sendDeliveryComplete = async (bid)=>{
    return await Bid.findByIdAndUpdate(bid,{status:"delivery"},  {new:true})
}

module.exports = {
    bidPost,
    productBid,
    selfBid,
    getBidById,
    deleteBidById,
    getAllBid,
    sendDelivery,
    sendDeliveryComplete
}
