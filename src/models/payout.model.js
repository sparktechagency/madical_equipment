const mongoose = require("mongoose");

const payoutSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    availableAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["approve", "decline", "pending"],
      default: "pending",
    },
    image: {
      type: String, // Stripe connected account ID
      required: false,
    },
    transactionId: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payout", payoutSchema);
