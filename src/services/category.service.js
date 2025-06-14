const httpStatus = require("http-status")
const { Category } = require("../models")
const ApiError = require("../utils/ApiError")

const createCategory = async(payload) =>{
    return await Category.create(payload)
}

const allCategory = async() =>{
    return await Category.find({isDeleted:false}).select('name image')
}
const singleCategory = async(id) =>{
    return await Category.findById(id).select('name image')
}

const findCategoryByID = async(id) =>{
    const  category  = await Category.findById(id)
    if (!category || category.isDeleted) throw new ApiError(httpStatus.BAD_REQUEST, "category not found!")
    return category
}
const updateCategory = async(id ,payload) =>{
    const  category  = await Category.findById(id)
    if (!category || category.isDeleted) throw new ApiError(httpStatus.BAD_REQUEST, "category not found!")

    if(payload?.image) category.image = payload?.image 
    if(payload?.name) category.name = payload?.name
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
    findCategoryByID,
    updateCategory,
    deleteCategory,
    singleCategory
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
// const updateAll = async()=>{
//     const res = await Category.updateMany({},{$set :{
//         image:`uploads/category/monitor-1747563990527.png`
//     }})
//     console.log(res);
// }

// updateAll()