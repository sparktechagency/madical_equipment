const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String, 
      required: [true, "category must required !"],
    },
    image: {
      type: String, 
      required: [true, "image must required !"],
    },
    isDeleted: {
      type: Boolean, 
      default: false,
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model('Category', categorySchema);
