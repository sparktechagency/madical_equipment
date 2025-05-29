const httpStatus = require("http-status");
const response = require("../config/response");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");
const {
  createContactMessage,
  getAllContactMessages,
  getContactMessageById,
  markContactMessageAsRead,
  deleteContactMessageById,
} = require("../services/contactMessage.service");

// User - Create message
const CreateContactMessage = catchAsync(async (req, res) => {
  const { name, email, phone, message } = req.body;

  const result = await createContactMessage({ name, email, phone, message });

  res.status(httpStatus.CREATED).json(
    response({
      message: "Contact message sent successfully",
      status: "Created",
      statusCode: httpStatus.CREATED,
      data: result,
    })
  );
});

// Admin - Get all messages
const GetAllContactMessages = catchAsync(async (req, res) => {
  const result = await getAllContactMessages();

  res.status(httpStatus.OK).json(
    response({
      message: "All contact messages retrieved successfully",
      status: "OK",
      statusCode: httpStatus.OK,
      data: result,
    })
  );
});

// Admin - Get single message by ID
const GetSingleContactMessage = catchAsync(async (req, res) => {
  const { id } = req.params;

  const message = await getContactMessageById(id);
  if (!message || message.isDeleted) {
    throw new ApiError(httpStatus.NOT_FOUND, "Contact message not found");
  }

  res.status(httpStatus.OK).json(
    response({
      message: "Contact message retrieved successfully",
      status: "OK",
      statusCode: httpStatus.OK,
      data: message,
    })
  );
});

// Admin - Mark message as read
const MarkContactMessageRead = catchAsync(async (req, res) => {
  const { id } = req.params;

  const message = await markContactMessageAsRead(id);
  if (!message) {
    throw new ApiError(httpStatus.NOT_FOUND, "Contact message not found");
  }

  res.status(httpStatus.OK).json(
    response({
      message: "Contact message marked as read",
      status: "OK",
      statusCode: httpStatus.OK,
      data: message,
    })
  );
});

// Admin - Delete message (soft delete)
const DeleteContactMessage = catchAsync(async (req, res) => {
  const { id } = req.params;

  const message = await deleteContactMessageById(id);
  if (!message) {
    throw new ApiError(httpStatus.NOT_FOUND, "Contact message not found");
  }

  res.status(httpStatus.OK).json(
    response({
      message: "Contact message deleted successfully",
      status: "OK",
      statusCode: httpStatus.OK,
      data: {},
    })
  );
});

module.exports = {
  CreateContactMessage,
  GetAllContactMessages,
  GetSingleContactMessage,
  MarkContactMessageRead,
  DeleteContactMessage,
};
