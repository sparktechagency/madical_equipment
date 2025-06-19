const { Report } = require("../models")

const createReport = async(payload)=>{
    return await Report.create(payload)
}

const getReportById = async(id)=>{
    return await Report.findById(id)
    .populate("author", "name email phone image address")
    .populate({
        path:"bid",
        select:"title description price images",
        populate:[{
            path:'author',
            select:"name email phone image address"
        },{
            path:'product',
            select:"title images price description"
        }],
    })
}

const getAllReport = async(status)=>{
    const filter = {
        isDeleted:false,
    }
    if(status) filter.status = status

    const res = await Report.find(filter)
    .populate("author", "name email phone image address")
    .populate({
        path:"bid",
        select:"title description price images",
        populate:{
            path:'author',
            select:"name email phone image address"
        }
    })
    return res
}

const deleteReportById = async(id)=>{
    return await Report.findByIdAndUpdate(id,{isDeleted:true})
}

module.exports = {
    createReport,
    getReportById,
    getAllReport,
    deleteReportById
}