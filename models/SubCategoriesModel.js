const mongoose = require("mongoose");
const Joi = require('joi'); 

const SubCategorySchema = new mongoose.Schema({
    name:{
        type: String,
        trim: true,
        unique: [true , 'Category must be unique'],
        minlength: [2, 'the subCategory name is too short'],
        maxlength: [32 , 'The subCategory name is so big'] 
    },

    slug:{
        type: String,
        lowercase: true,
    },

    category:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Categories"
    }
},{timestamps: true})

//Validate create a new book
function validateCreateSubCategory(obj){
    const schema = Joi.object({
        name: Joi.string().min(2).max(32).required(),
        category: Joi.string().required()
    });
    return schema.validate(obj) 
}

//Validate Update a  book
function validateUpdateSubCategory(obj){
    const schema = Joi.object({
        name: Joi.string().min(2).max(32),
        category: Joi.string()
    });
    return schema.validate(obj) 
}

const SubCategories = mongoose.model("SubCategories", SubCategorySchema);

module.exports={
    SubCategories,
    validateCreateSubCategory,
    validateUpdateSubCategory
}