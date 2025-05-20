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
    status: { 
        type:String,
        enum:["pending", "approve", "declined"],
        default:"pending", 
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

module.exports = mongoose.model("Bid", bidSchema)