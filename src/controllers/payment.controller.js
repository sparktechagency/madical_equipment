const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const response = require("../config/response");
const catchAsync = require("../utils/catchAsync");
const { createPayment, handlePaymentSuccess, handlePaymentFailure } = require("../services/payment.service");
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
    const transaction = await createPayment(data)

  // payment session create
  const session = await stripe.checkout.sessions.create({
    success_url: 'https://www.linkedin.com/in/dipudebnath',
    cancel_url: 'https://www.linkedin.com/in/dipudebnath',

    line_items: [
      {
        price_data: {
          unit_amount: bid.bidAmount*100, 
          currency: 'usd', 
          product_data: {
            name: bid.product.title,
          },
        },
        quantity: 1, 
      }, 
    ],
    mode: 'payment',
    metadata: {
      author:author,
      bid:bid._id.toString(),
      transaction: transaction._id.toString()
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


  //LastSubscriptionPurchasedUser
const handleStripeWebhook = catchAsync(async (req, res) => {

const sig = req.headers['stripe-signature'];
let event;
try {
  // Verify webhook signature
  
  event = stripe.webhooks.constructEvent(req.rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
} catch (err) {
  console.error('Webhook signature verification failed:', err.message);
  return res.status(400).send(`Webhook error: ${err.message}`);
}


    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        await handlePaymentSuccess(session);
        break;
      case 'invoice.payment_failed':
        const invoice = event.data.object;
        await handlePaymentFailure(invoice);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  
  // response 
    res.status(httpStatus.OK).send('Event received')
  });
  
module.exports = {
    CreatePayment,
    handleStripeWebhook
}