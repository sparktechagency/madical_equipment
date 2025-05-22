const { Bid } = require("../models")
const {ObjectId} = require("mongoose").Types

const bidPost = async(payload)=>{
    await Bid.create(payload)
}

const allBid = async(product, status)=>{
    const filter = {
        product: new ObjectId(product),
        isDeleted:false
    }
    if(status) filter.status= status

    return await Bid.find({isDeleted: false}).sort({createdAt:-1}).select("-isDeleted -createdAt -updatedAt").populate('author', "name address").populate({
        path:'product',
        select:"-createdAt -updatedAt -isDeleted",
        populate:{path:"author",
            select:"name address",
        }
    })
}

const selfBid = async(user)=>{
    return await Bid.find({author: new ObjectId(user)}).sort({createdAt:-1}).select("-isDeleted -createdAt -updatedAt").populate('author', "name address").populate({
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
        select:"-createdAt -updatedAt -isDeleted",
        populate:{path:"author",
            select:"name address",
        }
    })
}

const deleteBidById = async(id)=>{
     await Bid.findByIdAndUpdate(id, {isDeleted:true})
    return {}
    }

module.exports = {
    bidPost,
    allBid,
    selfBid,
    getBidById,
    deleteBidById
}
