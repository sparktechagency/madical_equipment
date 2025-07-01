const mongoose = require("mongoose");

const bidSchema = new mongoose.Schema(
  {
    author: { 
      type: mongoose.Schema.Types.ObjectId, 
      required: [true, "author is required "],
        ref:"User"
    },
    product: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: [true, "author is required "],
        ref:"Product"
    },
    bidAmount: { 
        type: Number, 
        required: [true, "amount is required "]
    },
    paymentStatus:{
      type:String,
      enum:["paid", "unpaid"],
      required:false
    },
    status: { 
        type:String,
        enum:["pending",  "progress", "shipped", "delivery", "cancelled"],
        default:"pending", 
    },
    isWinner:{
      type:Boolean,
      default:false
    },
    isDeleted: {
        type:Boolean,
        default:false, 
    },
  },
  { 
    timestamps: true,
    versionKey: false
  }
);

module.exports = mongoose.model("Bid", bidSchema);
