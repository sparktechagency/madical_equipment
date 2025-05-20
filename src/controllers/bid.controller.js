const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const { productService, bidService } = require("../services");
const response = require("../config/response");

const AddBid = catchAsync(async (req, res) => {
    const {product, amount} = req.body

    if (!product && !amount && amount < 0) throw new ApiError(httpStatus.BAD_REQUEST, " product and amount are required")
        //product validation
        const isExistProduct = await productService.getProductById(product)
        if(isExistProduct.isDeleted) throw new ApiError(httpStatus.BAD_REQUEST, " product is deleted !")
        if(new Date(isExistProduct.date) < new Date()) throw new ApiError(httpStatus.BAD_REQUEST, " bid time expires !")
//create bid
    const bid = await bidService.bidPost({product, amount, author:req.user.id})
  
    res.status(httpStatus.OK).json(
      response({
        message: 'bidding success',
        status: 'OK',
        statusCode: httpStatus.OK,
        data: bid,
      })
    );
  });


const AllBid = catchAsync(async (req, res) => {
    const result = await bidService.
    allBid()
    res.status(httpStatus.OK).json(
      response({
        message: 'all bid retrieved success',
        status: 'OK',
        statusCode: httpStatus.OK,
        data: result,
      })
    );
  });

const SingleBid = catchAsync(async (req, res) => {
    const {id} = req.params
    const result = await bidService.getBidById(id)
    if(!result || result.isDeleted) throw new ApiError(httpStatus.NOT_FOUND, "bit not found !")

    res.status(httpStatus.OK).json(
      response({
        message: 'Product retrieved success',
        status: 'OK',
        statusCode: httpStatus.OK,
        data: result,
      })
    );
  });

const DeleteBid = catchAsync(async (req, res) => {
    const {id} = req.params
    const bid = await bidService.getBidById(id)
    if(!bid || bid.isDeleted) throw new ApiError(httpStatus.NOT_FOUND, "bit not found !")

    const result = await bidService.deleteBidById(id)
    res.status(httpStatus.OK).json(
      response({
        message: 'Product delete success.',
        status: 'OK',
        statusCode: httpStatus.OK,
        data: result,
      })
    );
  });


module.exports = {
    AddBid,
    AllBid,
    SingleBid,
    DeleteBid
}