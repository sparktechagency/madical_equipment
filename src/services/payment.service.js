const { Transaction, Bid, Product, User } = require("../models")

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
        const bidRes = await Bid.findByIdAndUpdate(bid, {status:"progress", paymentStatus:"paid"}, {new:true})
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
  

module.exports = {
    createPayment,
    updatePaymentStatus,
    getAllPayments,
    handlePaymentSuccess,
    handlePaymentFailure
}