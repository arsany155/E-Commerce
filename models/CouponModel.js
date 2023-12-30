const mongoose = require("mongoose");
const Joi = require('joi');


const CouponSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'Coupon name required'],
        unique: true,
        },
    expire: {
            type: Date,
            required: [true, 'Coupon expire time required'],
        },
    discount: {
            type: Number,
            required: [true, 'Coupon discount value required'],
        },
},{timestamps: true})


const Coupon = mongoose.model("Coupon", CouponSchema);

module.exports={
    Coupon
}