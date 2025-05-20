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

    await Bid.find().sort({createdAt:-1}).populate('author', "name address").populate({
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
    getBidById,
    deleteBidById


}
