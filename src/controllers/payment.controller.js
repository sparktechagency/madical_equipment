const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const response = require("../config/response");
const catchAsync = require("../utils/catchAsync");
const { createPayment } = require("../services/payment.service");
const { getBidById } = require("../services/bid.service");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)


const CreatePayment = catchAsync(async (req, res) => {
    const {id} = req.params
    const {id:author} = req.user

    const bid = await getBidById(id)
    if(!bid || bid.isDeleted) throw new ApiError(httpStatus.NOT_FOUND, "Bid not fount !") 

    const data = {
        author,
        product : bid.product,
        amount : bid.bidAmount
    } 
// create transaction data 
    await createPayment(data)

  // payment session create
  const session = await stripe.checkout.sessions.create({
    success_url: 'https://github.com/dipudebnath1',
    line_items: [
      {
        price_data: {
          unit_amount: bid.bidAmount*100, // Amount in cents
          currency: 'usd',  // Set the appropriate currency
          product_data: {
            name: bid.product.name,
          },
        },
        quantity: 1, 
      },
    ],
    mode: 'payment',
    metadata: {
      author:author,
      bid:bid._id.toString(),
    },
  });
// payment response  
  res.status(httpStatus.OK).json(
    response({
      message: "product purchased url created",
      status: "payment method",
      statusCode: httpStatus.OK,
      data: {redirect:session?.url},
    })
  );
  });

module.exports = {
    CreatePayment
}