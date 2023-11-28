const mongoose = require("mongoose");
const Joi = require('joi');    //we use it for validation

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true , 'Category must required'],
        unique: [true , 'Category must be unique'],
        minlength: [3, 'the name is too short'],
        maxlength: [32 , 'The name is so big']    
    },

    slug:{
        type: String,
        lowercase: true,
    },

    image: {
        type: String
    }

},{timestamps:true});

//Validate create a new book
function validateCreateCategory(obj){
    const schema = Joi.object({
        name: Joi.string().min(3).max(32).required(),
        image: Joi.string().optional()
    });
    return schema.validate(obj) 
}

//Validate Update a  book
function validateUpdateCategory(obj){
    const schema = Joi.object({
        name: Joi.string().min(3).max(32),
    });
    return schema.validate(obj) 
}

//works in update , get all , get one
CategorySchema.post('init', function(doc){
    if(doc.image){
        const imageURL = `${process.env.Base_URL}/categories/${doc.image}`
        doc.image= imageURL
    }
})
//this one for when creating new category 
CategorySchema.post('save', function(doc){
    if(doc.image){
        const imageURL = `${process.env.Base_URL}/categories/${doc.image}`
        doc.image= imageURL
    }
})


const Categories = mongoose.model("Categories", CategorySchema);


module.exports = {
    Categories,
    validateCreateCategory,
    validateUpdateCategory
}