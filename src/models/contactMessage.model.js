const mongoose = require("mongoose");
const validator = require("validator");

const contactMessageSchema = new mongoose.Schema(
    {
         name: {
           type: String,
           required: true,
           trim: true,
         },
         email: {
           type: String,
           required: true,
           trim: true,
           lowercase: true,
           validate(value) {
             if (!validator.isEmail(value)) {
               throw new Error("Invalid email");
             }
           },
         },
         phone: {
           type: String,
           required: true,
         },
        message: { 
            type: String, required: [true, "message is must be Required"] 
        },
        isDeleted:{
            type:Boolean,
            default:false,
        },
        isRead:{
            type:Boolean,
            default:false,
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("ContactMessage", contactMessageSchema);
