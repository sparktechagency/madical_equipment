const httpStatus = require("http-status");
const { ContactMessage } = require("../models"); // assuming you export it from models/index or adjust path
const ApiError = require("../utils/ApiError");

const createContactMessage = async (payload) => {
  return await ContactMessage.create(payload);
};

const getAllContactMessages = async () => {
    return await ContactMessage.find({ isDeleted: false }).sort({ isRead: 1, createdAt: -1 });
  };
  

const getContactMessageById = async (id) => {
  return await ContactMessage.findById(id);
};

const markContactMessageAsRead = async (id) => {
  const message = await ContactMessage.findById(id);
  if (!message) throw new ApiError(httpStatus.BAD_REQUEST, "message not found!");
  message.isRead = true;
  await message.save();
  return message;
};

const deleteContactMessageById = async (id) => {
  const message = await ContactMessage.findById(id);
  if (!message) throw new ApiError(httpStatus.BAD_REQUEST, "message not found!");
  message.isDeleted = true;
  await message.save();
  return message;
};

module.exports = {
  createContactMessage,
  getAllContactMessages,
  getContactMessageById,
  markContactMessageAsRead,
  deleteContactMessageById,
};
