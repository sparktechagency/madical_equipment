const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const { productService, bidService } = require("../services");
const response = require("../config/response");
const catchAsync = require("../utils/catchAsync");

const AddBid = catchAsync(async (req, res) => {
    const {product, amount} = req.body

    if (!product || !amount || amount < 0) throw new ApiError(httpStatus.BAD_REQUEST, " product and amount are required")
        //product validation
        const isExistProduct = await productService.getProductById(product)
        console.log(isExistProduct);
        if(!isExistProduct || isExistProduct?.status!=="approve") throw new ApiError(httpStatus.BAD_REQUEST, "product not found !")
        if(isExistProduct?.isDeleted) throw new ApiError(httpStatus.BAD_REQUEST, " product is deleted !")
        if(new Date(isExistProduct?.date) < new Date()) throw new ApiError(httpStatus.BAD_REQUEST, "product biding time expires !")
//create bid
    const bid = await bidService.bidPost({product, bidAmount:amount, author:req.user.id})
  
    res.status(httpStatus.OK).json(
      response({
        message: 'bidding success',
        status: 'OK',
        statusCode: httpStatus.OK,
        data: bid,
      })
    );
  });

//add bid
const AllBid = catchAsync(async (req, res) => {
  const {id} = req.params
  const {role, id:user} = req.user
  const product = await productService.getProductById(id)
  if(!product || (product.author.toString()!==user && role!=="admin")) throw  new ApiError(httpStatus.BAD_REQUEST, "product not found")
  const {status} = req.query
    const result = await bidService.
    allBid(id, status)
    res.status(httpStatus.OK).json(
      response({
        message: 'all bid retrieved success',
        status: 'OK',
        statusCode: httpStatus.OK,
        data: result,
      })
    );
  });

const SelfBid = catchAsync(async (req, res) => {
  const {id}= req.user    
  const result = await bidService.
    selfBid(id)
    res.status(httpStatus.OK).json(
      response({
        message: 'self retrieved success',
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
    const {id, role} = req.params
    const bid = await bidService.getBidById(id)
    if(!bid || bid.isDeleted) throw new ApiError(httpStatus.NOT_FOUND, "bit not found !")
      //user validation
    if(role!=="admin" || bid.author?._id!==id) throw new ApiError(httpStatus.UNAUTHORIZED, "you are unauthorized !")

    const result = await bidService.deleteBidById(id)
    res.status(httpStatus.OK).json(
      response({
        message: 'bid remove success.',
        status: 'OK',
        statusCode: httpStatus.OK,
        data: result,
      })
    );
  });


module.exports = {
    AddBid,
    AllBid,
    SelfBid,
    SingleBid,
    DeleteBid
}