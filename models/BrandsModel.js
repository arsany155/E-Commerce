const mongoose = require("mongoose");
const Joi = require('joi');


const BrandSchema = new mongoose.Schema({
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

    image: {
        type: String
    }
},{timestamps: true})

//Validate create a new book
function validateCreateBrand(obj){
    const schema = Joi.object({
        name: Joi.string().min(3).max(32).required(),
        image: Joi.string()
    });
    return schema.validate(obj) 
}

//Validate Update a  book
function validateUpdateBrand(obj){
    const schema = Joi.object({
        name: Joi.string().min(3).max(32),
    });
    return schema.validate(obj) 
}


//works in update , get all , get one
BrandSchema.post('init', function(doc){
    if(doc.image){
        const imageURL = `${process.env.Base_URL}/brands/${doc.image}`
        doc.image= imageURL
    }
})
//this one for when creating new category 
BrandSchema.post('save', function(doc){
    if(doc.image){
        const imageURL = `${process.env.Base_URL}/brands/${doc.image}`
        doc.image= imageURL
    }
})


const Brand = mongoose.model("Brand", BrandSchema);

module.exports={
    Brand,
    validateCreateBrand,
    validateUpdateBrand
}