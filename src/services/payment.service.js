const { Transaction, Bid, Product, User } = require("../models")
const {ObjectId} = require("mongoose").Types

const createPayment = async (payload)=>{
    const payment = new Transaction(payload)
    return await payment.save()
}

const updatePaymentStatus = async (id, status, transactionId)=>{
    const updateData = {
        status, 
        transaction: transactionId
    }
    return await Transaction.findByIdAndUpdate(id, updateData,  {new:true})

}

//get all payments
const getAllPayments = async ()=>{
    return await Transaction.find().populate('author', "name address").populate('product').sort({createdAt:-1}).select("-isDeleted -__v")
}

//handlePaymentSuccess
const handlePaymentSuccess = async (session) => {
    console.log(session);
    try {
      const {payment_intent, metadata, amount_total} =  session
      // Destructure metadata from session
      const {
        author,
        bid,
        transaction
      } = metadata || {}; 
  
      //update bid status to "progress"
        const bidRes = await Bid.findByIdAndUpdate(bid, 
          {status:"progress", 
            paymentStatus:"paid"}, 
            {new:true})
        // product status to sold
        await Product.findByIdAndUpdate(bidRes.product, {status:"sold"})
        // update seller's balance and total income
        const seller = await User.findByIdAndUpdate(author)
        seller.currentBalance = seller.currentBalance + ((amount_total/100)*0.9)
        seller.totalIncome = seller.totalIncome + ((amount_total/100)*0.9)
        await seller.save()
      // Update SubscriptionPurchase status to "success"
      const updatedSubscription = await Transaction.findByIdAndUpdate(
        transaction,
        { status: "success", transactionId:payment_intent },
        { new: true } // Optional: If you want to return the updated document
      );
  
      if (!updatedSubscription) {
        throw new Error("Subscription Purchase not found or failed to update");
      }
  
    } catch (error) {
      console.error("Error handling payment success:", error.message);
      // You might want to log this or send a failure response depending on your app's requirements
    }
  };
  
  // Handle payment failure
const handlePaymentFailure = async (invoice) => {
    console.log("payment failed ", invoice);
    
  };

  // client earnings
 const getSellerEarnings = async (sellerId)=>{
  const pipeline = [
    {
      $match:{
        author: new ObjectId(sellerId),
        status:"sold"
      }
    },  
    {
      $lookup:{
        from:"transactions",
        localField:"_id",
        foreignField:"product",
        as: "transactions"
      }
    },
    {
      $unwind:"$transactions"
    },
    {
      $match:{
        "transactions.status":"success"
      }
    },
    {
      $lookup: {
        from:'users',
        localField:"transactions.author",
        foreignField:"_id",
        as:"transactions.author"
      }
    },
    {$unwind:"$transactions.author"},
    {
      //response model
      $project:{
          product:{
            "title":"$title",
            "description":"$description",
            "images":"$images",
          },
          // transactions:{
            _id:"$transactions._id",
            amount: "$transactions.amount",
            transactionId: "$transactions.transactionId",
            status: "$transactions.status",
            createdAt: "$transactions.createdAt",
          // },
          author:{
            _id:"$transactions.author._id",
            name: "$transactions.author.name",
            email: "$transactions.author.email",
            phone: "$transactions.author.phone",
            address: "$transactions.author.address"
          }
      }
    }
  ]

  const earnings = await Product.aggregate(pipeline)
  return earnings

 }

 //single transaction 
 const getSingleTransaction = async (transactionId) =>{
  return await Transaction.findById(transactionId)
  .select('-isDeleted -updatedAt')
  .populate('author', 'name address email phone')
  .populate({
    path:"product",
    select:"author title description images price",
    populate:{
      path:"author",
      select:"name address email phone"
    }
  }) }

 const allProductPayments = async()=>{
  return await Transaction.find({status:"success"})
  .select("-updatedAt -isDeleted")
  .populate('author', "name address email phone image")
  .populate({
    path:"product",
    select:"author title description images price",
    populate:{
      path:"author",
      select:"name address email phone image"
    }
  })
 }

//  const updateAllTransactions = async()=>{
//   await Transaction.deleteMany({status:{$ne:"success"}})
//  }

//  updateAllTransactions()

module.exports = {
    createPayment,
    updatePaymentStatus,
    getAllPayments,
    handlePaymentSuccess,
    handlePaymentFailure,
    getSellerEarnings,
    getSingleTransaction,
    allProductPayments
}