const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const { productService, bidService } = require("../services");
const response = require("../config/response");
const catchAsync = require("../utils/catchAsync");
const { getAllOrder, getSingleOrder } = require("../services/bid.service");

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

//all bid
const ProductBid = catchAsync(async (req, res) => {
  const {status} = req.query
  const {id} = req.params
  const {role, id:user} = req.user
  const product = await productService.getProductById(id)
  if(!product || (product.author.toString()!==user && role!=="admin")) throw  new ApiError(httpStatus.BAD_REQUEST, "product not found")
    const result = await bidService.
  productBid(id, status)
    res.status(httpStatus.OK).json(
      response({
        message: 'products bid retrieved success',
        status: 'OK',
        statusCode: httpStatus.OK,
        data: result,
      })
    );
  });
  
const AllBid = catchAsync(async (req, res) => {
  const {status} = req.query
  const {role, id:user} = req.user
    const result = await bidService.getAllBid(user, role, status)
    res.status(httpStatus.OK).json(
      response({
        message: 'all bid retrieved success.',
        status: 'OK',
        statusCode: httpStatus.OK,
        data: result,
      })
    );
});

const SelfBid = catchAsync(async (req, res) => {
  const {id}= req.user    
  const {status}= req.query
  const result = await bidService.selfBid(id, status)
    res.status(httpStatus.OK).json(
      response({
        message: 'self retrieved success',
        status: 'OK',
        statusCode: httpStatus.OK,
        data: result,
      })
    );
    console.log(result);
  });

const UserBid = catchAsync(async (req, res) => {
  const {id}= req.params    
  const {status}= req.query
  const result = await bidService.selfBid(id, status)
    res.status(httpStatus.OK).json(
      response({
        message: 'user retrieved success',
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

const GetAllOrder = catchAsync(async (req, res) => {
    const {id} = req.user
    const {status} = req.query
    const result = await getAllOrder(id, status)
    res.status(httpStatus.OK).json(
      response({
        message: 'all order retrieved success.',
        status: 'OK',
        statusCode: httpStatus.OK,
        data: result,
      })
    );
  });

const GetSingleOrder = catchAsync(async (req, res) => {
    const {id} = req.params
    const result = await getSingleOrder(id)
    res.status(httpStatus.OK).json(
      response({
        message: 'order retrieved success.',
        status: 'OK',
        statusCode: httpStatus.OK,
        data: result,
      })
    );
  });

const ProductDelivery = catchAsync(async(req, res)=>{
  const {id} = req.params
  const {id:owner} = req.user 
  //bid validation
  const bid = await bidService.getBidById(id)
  if(!bid || bid.isDeleted || !bid.isWinner) throw new ApiError(httpStatus.NOT_FOUND, "bid not found !")
    if(bid.product.author._id.toString()!==owner) throw new ApiError(httpStatus.BAD_REQUEST, "you are not product owner !")
    if(bid.status!=="progress") throw new ApiError(httpStatus.BAD_REQUEST, "bid.status is not progress")
  //bid status update
  const result = await bidService.sendDelivery(id)
  //response
  res.status(httpStatus.OK).json(
    response({
      message: "product going delivery.",
      status:'OK',
      statusCode:httpStatus.OK,
      data: result
    })
  )

})

const ProductDeliveryCompleted = catchAsync(async(req, res)=>{
  const {id} = req.params
  const {id:owner} = req.user 
  //bid validation
  const bid = await bidService.getBidById(id)
  if(!bid || bid.isDeleted || !bid.isWinner) throw new ApiError(httpStatus.NOT_FOUND, "bid not found !")

    if(bid.product.author._id.toString()!==owner) throw new ApiError(httpStatus.BAD_REQUEST, "you are not product owner !")
    if(bid.status!=="shipped") throw new ApiError(httpStatus.BAD_REQUEST, "bid.status is not shipped !")
  //bid status update
  const result = await bidService.sendDeliveryComplete(id)
  //response
  res.status(httpStatus.OK).json(
    response({
      message: "product delivery completed.",
      status:'OK',
      statusCode:httpStatus.OK,
      data: result
    })
  )

})


module.exports = {
    AddBid,
    ProductBid,
    SelfBid,
    SingleBid,
    DeleteBid,
    AllBid,
    ProductDelivery,
    ProductDeliveryCompleted,
    GetAllOrder,
    GetSingleOrder,
    UserBid
}