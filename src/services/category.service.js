const httpStatus = require("http-status")
const { Category } = require("../models")
const ApiError = require("../utils/ApiError")

const createCategory = async(payload) =>{
    return await Category.create(payload)
}

const allCategory = async() =>{
    return await Category.find({isDeleted:false}).select('name')
}

const singleCategory = async(id ,name) =>{
    const  category  = await Category.findById(id)
    if (!category || category.isDeleted) throw new ApiError(httpStatus.BAD_REQUEST, "category not found!")
    category.name = name
    await category.save()
}

const deleteCategory = async(id) =>{
    const  category  = await Category.findById(id)
    if (!category) throw new ApiError(httpStatus.BAD_REQUEST, "category not found!")
    
    category.isDeleted = true
    await category.save()
}



module.exports = {
    createCategory,
    allCategory,
    singleCategory,
    deleteCategory
}


// demo data 
    const category =  [
        {"name": "Diagnostic Equipment"},
        {"name": "Surgical Instruments"},
        {"name": "Personal Protective Equipment (PPE)"},
        {"name": "Medical Consumables"},
        {"name": "Pharmaceutical Products"},
        {"name": "Patient Monitoring Systems"},
        {"name": "Imaging Devices"},
        {"name": "Wound Care Products"},
        {"name": "Respiratory Equipment"},
        {"name": "Orthopedic Supplies"}
      ]
const updateAll = async()=>{
    await Category.create(category)
}
// updateAll()