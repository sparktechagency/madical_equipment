const { Transaction } = require("../models")

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



module.exports = {
    createPayment,
    updatePaymentStatus,
    getAllPayments
}