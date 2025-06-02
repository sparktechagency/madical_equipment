const httpStatus = require("http-status");
const response = require("../config/response");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");

const {
  getPrivacyPolicy,
  upsertPrivacyPolicy,
  getAboutUs,
  upsertAboutUs,
  getTermsAndCondition,
  upsertTermsAndCondition,
  getSellerAgreement,
  upsertSellerAgreement,
  getUserAgreement, 
  upsertUserAgreement
 } = require("../services/setting.service");

// Privacy Policy Controllers
const GetPrivacy = catchAsync(async (req, res) => {
  const data = await getPrivacyPolicy();

  res.status(httpStatus.OK).json(
    response({
      message: "Privacy policy retrieved successfully.",
      status: "OK",
      statusCode: httpStatus.OK,
      data,
    })
  );
});

const UpsertPrivacy = catchAsync(async (req, res) => {
  const { content } = req.body;
  if (!content) throw new ApiError(httpStatus.BAD_REQUEST, "Content is required");

  const result = await upsertPrivacyPolicy(content);

  res.status(httpStatus.OK).json(
    response({
      message: "Privacy policy updated successfully.",
      status: "OK",
      statusCode: httpStatus.OK,
      data: result,
    })
  );
});

// About Us Controllers
const GetAboutUs = catchAsync(async (req, res) => {
  const data = await getAboutUs();

  res.status(httpStatus.OK).json(
    response({
      message: "About Us retrieved successfully.",
      status: "OK",
      statusCode: httpStatus.OK,
      data,
    })
  );
});

const UpsertAboutUs = catchAsync(async (req, res) => {
  const { content } = req.body;
  if (!content) throw new ApiError(httpStatus.BAD_REQUEST, "Content is required");

  const result = await upsertAboutUs(content);

  res.status(httpStatus.OK).json(
    response({
      message: "About Us updated successfully.",
      status: "OK",
      statusCode: httpStatus.OK,
      data: result,
    })
  );
});

// Terms & Conditions Controllers
const GetTermsAndCondition = catchAsync(async (req, res) => {
  const data = await getTermsAndCondition();

  res.status(httpStatus.OK).json(
    response({
      message: "Terms and Conditions retrieved successfully.",
      status: "OK",
      statusCode: httpStatus.OK,
      data,
    })
  );
});

const UpsertTermsAndCondition = catchAsync(async (req, res) => {
  const { content } = req.body;
  if (!content) throw new ApiError(httpStatus.BAD_REQUEST, "Content is required");

  const result = await upsertTermsAndCondition(content);

  res.status(httpStatus.OK).json(
    response({
      message: "Terms and Conditions updated successfully.",
      status: "OK",
      statusCode: httpStatus.OK,
      data: result,
    })
  );
});

// Seller Agreement Controllers
const GetSellerAgreement = catchAsync(async (req, res) => {
  const data = await getSellerAgreement();

  res.status(httpStatus.OK).json(
    response({
      message: "Seller Agreement retrieved successfully.",
      status: "OK",
      statusCode: httpStatus.OK,
      data,
    })
  );
});

const UpsertSellerAgreement = catchAsync(async (req, res) => {
  const { content } = req.body;
  if (!content) throw new ApiError(httpStatus.BAD_REQUEST, "Content is required");

  const result = await upsertSellerAgreement(content);

  res.status(httpStatus.OK).json(
    response({
      message: "Seller Agreement updated successfully.",
      status: "OK",
      statusCode: httpStatus.OK,
      data: result,
    })
  );
});

// User Agreement Controllers
const GetUserAgreement = catchAsync(async (req, res) => {
  const data = await getUserAgreement();

  res.status(httpStatus.OK).json(
    response({
      message: "User Agreement retrieved successfully.",
      status: "OK",
      statusCode: httpStatus.OK,
      data: data,
    })
  );
});

const UpsertUserAgreement = catchAsync(async (req, res) => {
  const { content } = req.body;
  if (!content) throw new ApiError(httpStatus.BAD_REQUEST, "Content is required");

  const result = await upsertUserAgreement(content);

  res.status(httpStatus.OK).json(
    response({
      message: "User Agreement updated successfully.",
      status: "OK",
      statusCode: httpStatus.OK,
      data: result,
    })
  );
});

module.exports = {
  GetPrivacy,
  UpsertPrivacy,
  GetAboutUs,
  UpsertAboutUs,
  GetTermsAndCondition,
  UpsertTermsAndCondition,
  GetSellerAgreement,
  UpsertSellerAgreement,
  GetUserAgreement,
  UpsertUserAgreement,
};
