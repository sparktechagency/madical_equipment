const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema.Types

const ReportSchema = new mongoose.Schema(
  {
    author: { 
      type: ObjectId, 
      required: [true, "author is required"], 
      ref:"User"
    },
    bid: { 
      type: ObjectId, 
      required: [true, "product is required"], 
      ref:"Bid"
    },
    title: { 
      type: String, 
      required: [true, "report title is required"], 
    },
    description: { 
      type: String, 
      required: [true, "report description is required"], 
    },
    read:{
        type:Boolean,
        default:false
    },
    isDeleted: { 
      type: Boolean, 
      default:false
    },
  },
  { 
    timestamps: true,
    versionKey: false
  }
);

module.exports = mongoose.model("Report", ReportSchema);
