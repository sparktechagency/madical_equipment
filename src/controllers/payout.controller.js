const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");
const {
  createPayoutRequest,
  getAllPayoutRequests,
  getPayoutRequestById,
  updatePayoutStatus,
  sellerSelfPayoutHistory,

  // createStripeAccount,
} = require("../services/payout.service");

// Seller creates payout request
const CreatePayout = catchAsync(async (req, res) => {
  const { _id: author } = req.user;
  const { amount } = req.body;
  if (!amount) throw new ApiError(httpStatus.BAD_REQUEST, "Amount is required");

  const payout = await createPayoutRequest({ author, amount });

  res.status(httpStatus.CREATED).json({
    message: "Payout request send successfully",
    statusCode: httpStatus.CREATED,
    data: payout,
  });
});

// get all payout 
const GetAllPayouts = catchAsync(async (req, res) => {
  const {status} = req.query
  const payouts = await getAllPayoutRequests(status);
  res.status(httpStatus.OK).json({
    message: "Payout requests retrieved successfully",
    statusCode: httpStatus.OK,
    data: payouts,
  });
});

// seller self payout history 
const SellerSelfPayoutHistory = catchAsync(async (req, res) => {
  const {id} = req.user
  const payouts = await sellerSelfPayoutHistory(id);
  res.status(httpStatus.OK).json({
    message: "Payout history retrieved successfully",
    statusCode: httpStatus.OK,
    data: payouts,
  });
});

// Admin: Get single payout details
const GetSinglePayout = catchAsync(async (req, res) => {
  const { id } = req.params;
  const payout = await getPayoutRequestById(id);
  if (!payout) throw new ApiError(httpStatus.NOT_FOUND, "Payout request not found");

  res.status(httpStatus.OK).json({
    message: "Payout request retrieved successfully",
    statusCode: httpStatus.OK,
    data: payout,
  });
});

// Admin: Approve or decline payout request
const UpdatePayoutStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if(!["approve", "decline"].includes(status)) throw new ApiError(httpStatus.BAD_REQUEST, "please provide valid status:[approve, decline]!")
  const payload = {status}
  // image validation 
  if (status==='approve' && !req.file) throw new ApiError(httpStatus.BAD_REQUEST, "payment prove image required!")
  payload.image = `uploads/payment/${req?.file?.filename}`

  const payout = await updatePayoutStatus(id, payload);

  res.status(httpStatus.OK).json({
    message: `Payout request ${status} successfully`,
    statusCode: httpStatus.OK,
    data: payout,
  });
});


module.exports = {
  CreatePayout,
  GetAllPayouts,
  GetSinglePayout,
  UpdatePayoutStatus,
  SellerSelfPayoutHistory

};
