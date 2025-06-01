const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const response = require("../config/response");
const catchAsync = require("../utils/catchAsync");
const { sellerDashboardStatistics, sellerRecentSellingProduct, getSellerIncomeLast12Months, adminDashboardStatistics, allTransactionRatio } = require("../services/dashboard.service");

//  Seller Dashboard Statistics
const SellerDashboardStatistics = catchAsync(async (req, res) => {
    const {id} = req.user
    const result = await sellerDashboardStatistics(id)
      res.status(httpStatus.OK).json(
        response({
          message: 'dashboard statistics retrieved success.',
          status: 'OK',
          statusCode: httpStatus.OK,
          data: result,
        })
      );
});

//  Seller Dashboard Statistics
const SellerRecentSelling = catchAsync(async (req, res) => {
    const {id} = req.user
    const result = await sellerRecentSellingProduct(id)
      res.status(httpStatus.OK).json(
        response({
          message: 'dashboard statistics retrieved success.',
          status: 'OK',
          statusCode: httpStatus.OK,
          data: result,
        })
      );
});
// Get Seller IncomeLast 12Months
const GetSellerIncomeLast12Months = catchAsync(async (req, res) => {
    const {id} = req.user
    const result = await getSellerIncomeLast12Months(id)
      res.status(httpStatus.OK).json(
        response({
          message: 'dashboard statistics retrieved success.',
          status: 'OK',
          statusCode: httpStatus.OK,
          data: result,
        })
      );
});

//  admin Dashboard Statistics
const AdminDashboardStatistics = catchAsync(async (req, res) => {
    const result = await adminDashboardStatistics()
      res.status(httpStatus.OK).json(
        response({
          message: 'dashboard statistics retrieved success.',
          status: 'OK',
          statusCode: httpStatus.OK,
          data: result,
        })
      );
});

//  admin Dashboard Statistics
const AllTransactionRation = catchAsync(async (req, res) => {
    const result = await allTransactionRatio()
      res.status(httpStatus.OK).json(
        response({
          message: 'transaction ratio retrieved success.',
          status: 'OK',
          statusCode: httpStatus.OK,
          data: result,
        })
      );
});




module.exports = {
    //seller
    SellerDashboardStatistics,
    SellerRecentSelling,
    GetSellerIncomeLast12Months,
    //admin
    AdminDashboardStatistics,
    AllTransactionRation
}