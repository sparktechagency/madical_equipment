const Payout = require("../models/payout.model");
const User = require("../models/user.model");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");

const createPayoutRequest = async ({ author, amount }) => {
  const user = await User.findById(author);
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, "User not found");

  if (amount <= 0) throw new ApiError(httpStatus.BAD_REQUEST, "Amount must be positive");
  if (user.currentBalance < amount) throw new ApiError(httpStatus.BAD_REQUEST, "Insufficient balance");

  const payout = await Payout.create({
    author,
    amount,
    availableAmount: user.currentBalance,
    status: "pending",
  });

  return payout;
};

const getAllPayoutRequests = async () => {
  return Payout.find().populate("author", "name email currentBalance stripe phone").sort({createdAt:-1});
};

const getPayoutRequestById = async (id) => {
    return Payout.findById(id).populate("author", "name email currentBalance stripe");
};


const updatePayoutStatus = async (id, payload) => {
    const payout = await Payout.findById(id)
    if (!payout) throw new ApiError(httpStatus.BAD_REQUEST, "this payout req not fount")
    if (payout.status!=="pending") throw new ApiError(httpStatus.BAD_REQUEST, `this payout req already ${payout.status}!`)
    
    const user = await User.findById(payout.author)
    if(!user) throw new ApiError(httpStatus.BAD_REQUEST, "user not found!")
    //balance update
    user.currentBalance = user.currentBalance-payout.amount
    await user.save()
    //payout confirm
    return await Payout.findByIdAndUpdate(id, payload,{new:true});
};



module.exports = {
    createPayoutRequest,
    getAllPayoutRequests,
    getPayoutRequestById,
    updatePayoutStatus,
    // createStripeAccount
};
