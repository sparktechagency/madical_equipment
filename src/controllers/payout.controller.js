const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");
const {
  createPayoutRequest,
  getAllPayoutRequests,
  getPayoutRequestById,
  updatePayoutStatus,

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

// crete seller stripe account 
// const CreateStripeAccount = catchAsync(async (req, res) => {
//   const { id: author } = req.user;

//   const result = await createStripeAccount(author);

//   res.status(httpStatus.CREATED).json({
//     message: "account ",
//     statusCode: httpStatus.CREATED,
//     data: result,
//   });
// });

// seller onboarding stripe account is complete 
// const OnBoardingStripeAccount = catchAsync(async (req, res) => {
//   const { id:sellerId } = req.query; // Get sellerId from query parameters

//       const seller = await User.findById(sellerId);
//       if (!seller || !seller.stripeAccountId) throw new ApiError (httpStatus.NOT_FOUND, 'Seller or Stripe Account not found!');

//       const account = await stripe.accounts.retrieve(seller.stripeAccountId);

//       if (account.details_submitted && account.capabilities.transfers.status === 'active') {
//           // Seller has successfully completed onboarding and can receive payouts
//           console.log(`Seller ${sellerId} Stripe onboarding completed successfully.`);
//           // You might want to update a flag in your Seller model: seller.stripeOnboarded = true;
//           // Redirect to seller dashboard with success message
//           // res.redirect(`${process.env.FRONTEND_URL}/seller-dashboard?status=stripe_connected_success`);
//           res.status(httpStatus.OK).json({
//             message: "stripe onboarding account connect successfully.",
//             statusCode: httpStatus.OK,
//             data: account,
//           });
//       }
//   res.status(httpStatus.CREATED).json({
//     message: "stripe onboarding account connect pending. ",
//     statusCode: httpStatus.OK,
//     data: account,
//   });
// });

// Admin: Get all payout requests
const GetAllPayouts = catchAsync(async (req, res) => {
  const payouts = await getAllPayoutRequests();
  res.status(httpStatus.OK).json({
    message: "Payout requests retrieved successfully",
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

};
