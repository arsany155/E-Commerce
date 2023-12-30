const mongoose = require("mongoose");
const Joi = require('joi');
const { Product} = require("./ProductsModel")

const ReviewSchema = new mongoose.Schema({
    title: {
        type: String
    },
    ratings: {
        type: Number,
        min: [1 , "Min rating value is 1.0"],
        max: [5 , "Max rating value is 5.0"],
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    },
    product: {
        type: mongoose.Schema.ObjectId,
        ref: "Products"
    },
}, { timestamps: true });

//Validate create a new book
function validatePostReview(obj) {
    const schema = Joi.object({
        title: Joi.string().min(2).max(100).optional(),
        ratings: Joi.number().min(1).max(5).required(),
        user: Joi.string().hex().length(24).required(),
        product: Joi.string().hex().length(24).required()
    });
    return schema.validate(obj);
}

//Validate update a new book
function validateUpdateReview(obj) {
    const schema = Joi.object({
        title: Joi.string().min(2).max(100),
        ratings: Joi.number().min(1).max(5),
    });
    return schema.validate(obj);
}


//populate
ReviewSchema.pre(/^find/, function(next){
    this.populate({path: 'user' , select: "name"})
    next()
})



const Review = mongoose.model("Review", ReviewSchema);

module.exports={
    Review,
    validatePostReview,
    validateUpdateReview
}