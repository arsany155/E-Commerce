const mongoose = require("mongoose");
const Joi = require('joi');

const ProductSchema = new mongoose.Schema({
    title:{
        type: String,
        trim: true,
        minlength: [3, 'the Product title is too short'],
        maxlength: [200 , 'The Product title is so big'],
        required: true,
        unique: true
    },

    slug:{
        type: String,
        lowercase: true,
        required: true
    },

    description: {
        type: String,
        required: true,
        minlength: [20, 'the Product description is too short'],
        maxlength: [2000 , 'The Product description is so big'], 
    },

    quantity: {
        type: Number,
        required: true
    },

    sold: {
        type: Number,
        default: 0
    },

    price:{
        type: Number,
        required: true,
        trim: true,
        min: [0, "too long product price"]
    },

    priceAfterDiscount:{
        type: Number
    },

    colors: [String],

    imagecover: {
        type: String,
        required: true
    },
    
    images: [String],

    category: {
        type: mongoose.Schema.ObjectId,
        ref: 'Categories',
        required: true
    },

    subcategories: [{
        type: mongoose.Schema.ObjectId,
        ref: 'SubCategories'
    }],

    brand: {
        type: mongoose.Schema.ObjectId,
        ref: 'Brand'
    },

    ratingsAverage: {
        type: Number,
        min: [0, "Rating must be above or equal 1.0"],
        max: [5, "Rating must be below or equal 5.0"],
        default: 0
    },

    ratingQuantity: {
        type: Number,
        default: 0
    }


},{timestamps: true , 
    toJSON: {virtuals: true},
    toObject: {virtuals: true}    
})

//Validate create a new book
function validateCreateProduct(obj){
    const schema = Joi.object({
        title: Joi.string().min(3).max(200).required(),
        description: Joi.string().min(20).max(2000).required(),
        quantity: Joi.number().required(),
        sold: Joi.number().default(0),
        price: Joi.number().required(),
        priceAfterDiscount: Joi.number().less(Joi.ref('price')).optional(),
        category: Joi.string().required(),
        subcategories: Joi.array().items(Joi.string()).optional(),
        brand: Joi.string().optional(),
        imagecover: Joi.string().required(),
        images: Joi.array().items(Joi.string()).optional(),
        ratingsAverage: Joi.number().min(0).max(5),
        ratingQuantity: Joi.number(),
        colors: Joi.array().items(Joi.string()).optional(),
    });
    return schema.validate(obj) 
}


//Validate Update a  book
function validateUpdateProduct(obj){
    const schema = Joi.object({
        title: Joi.string().min(3).max(200),
        slug: Joi.string(),
        description: Joi.string().min(20).max(500),
        quantity: Joi.number(),
        sold: Joi.number().default(0),
        price: Joi.number(),
        priceAfterDiscount: Joi.number(),
        category: Joi.string(),
        subcategories: Joi.string(),
        brand: Joi.string(),
        imagecover: Joi.string(),
        ratingsAverage: Joi.number().min(0).max(5),
        ratingQuantity: Joi.number(),
        colors: Joi.string(),
        images: Joi.string()
    });
    return schema.validate(obj) 
}


//works in update , get all , get one
ProductSchema.post('init', function(doc){
    if(doc.imagecover){
        const imageURL = `${process.env.Base_URL}/products/${doc.imagecover}`
        doc.imagecover= imageURL
    }
    if(doc.images){
        const imageslist = []   
        doc.images.forEach((image) => {
            const imageURL = `${process.env.Base_URL}/products/${image}`
            imageslist.push(imageURL)
        })
        doc.images = imageslist
    }
})
//this one for when creating new category 
ProductSchema.post('save', function(doc){
    if(doc.imagecover){
        const imageURL = `${process.env.Base_URL}/products/${doc.imagecover}`
        doc.imagecover= imageURL
    }
    if(doc.images){
        const imageslist = []   
        doc.images.forEach((image) => {
            const imageURL = `${process.env.Base_URL}/products/${image}`
            imageslist.push(imageURL)
        })
        doc.images = imageslist
    }
})


//get reviews of this product
ProductSchema.virtual('reviews',{
    ref: 'Review',
    foreignField: "product",
    localField: "_id"
})


// to do popluate 
ProductSchema.pre(/^find/ , function(next) {
    this.populate({ path: 'category' , select: 'name -_id'})
    next()
})

const Product = mongoose.model("Products", ProductSchema);

module.exports={
    Product,
    validateCreateProduct,
    validateUpdateProduct
}