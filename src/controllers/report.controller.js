const httpStatus = require("http-status");
const response = require("../config/response");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");
const { createReport, getAllReport, getReportById } = require("../services/report.service");
const { getBidById } = require("../services/bid.service");

//create product report
const CreateReport = catchAsync(async(req, res)=>{
    const {id:bid} = req.params
    const {title, description} = req.body
    const {_id:author} = req.user
    //product validation
    const isExistBid = await getBidById(bid)
    console.log({author, user:isExistBid.author._id});
    if(!isExistBid) throw new ApiError(httpStatus.NOT_FOUND, 'product not found !')
    if(isExistBid.author._id.toString()!==author.toString()) throw new ApiError(httpStatus.NOT_FOUND, 'you are not eligible for report this product !')
    //validation
    if(!title || !description) throw new ApiError(httpStatus.BAD_REQUEST, "title and description are required !")    
    //product created 
    const result = await createReport({author, bid, title, description})
    //response
    res.status(httpStatus.CREATED).json(
      response({
        message: "report created success.",
        status:'Created',
        statusCode:httpStatus.CREATED,
        data: result
      })
    )
  })

//all product report
const GetAllReport = catchAsync(async(req, res)=>{
    const {status} = req.query
    const result = await getAllReport(status)
    //response
    res.status(httpStatus.OK).json(
      response({
        message: "all report retrieved success.",
        status:'OK',
        statusCode:httpStatus.OK,
        data: result
      })
    )
  })

//create product report
const GetSingleReport = catchAsync(async(req, res)=>{
    const {id} = req.params
    const report = await getReportById(id)
    if(!report) throw new ApiError(httpStatus.NOT_FOUND, "report not found !")
        // report read status update
         report.read = true
         await report.save()
    //response
    res.status(httpStatus.OK).json(
      response({
        message: "report retrieved success.",
        status:'OK',
        statusCode:httpStatus.OK,
        data: report
      })
    )
  })

//create product report
const DeleteReport = catchAsync(async(req, res)=>{
    const {id} = req.params
    const report = await getReportById(id)
    if(!report) throw new ApiError(httpStatus.NOT_FOUND, "report not found !")
        // report read status update
         report.isDeleted = true
         await report.save()
    //response
    res.status(httpStatus.OK).json(
      response({
        message: "report delete success.",
        status:'OK',
        statusCode:httpStatus.OK,
        data: {}
      })
    )
  })

  module.exports = {
    CreateReport,
    GetAllReport,
    GetSingleReport,
    DeleteReport
  }