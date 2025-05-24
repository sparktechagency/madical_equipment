const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    author: { 
      type: mongoose.Schema.Types.ObjectId, 
      required: [true, "author is required!"],
        ref:"User"
    },
    product: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: [true, "author is required!"],
        ref:"Product"
    },
    amount: { 
        type: Number, 
        required: [true, "amount is required!"]
    },
    status: { 
        type:String,
        enum:["pending", "success", "cancelled", "failed"],
        default: "pending" 

    },
    transaction:{
      type:String,
      required:false
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

module.exports = mongoose.model("Transaction", transactionSchema)