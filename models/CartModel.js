const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
    {
        cartItems: [
        {
            product: {
                type: mongoose.Schema.ObjectId,
                ref: 'Products',
            },
            quantity: {
                type: Number,
                default: 1,
            },
            color: String,
            price: Number,
        },
        ],

        totalCartPrice: {
            type: Number
        },
        totalPriceAfterDiscount: {
            type: Number,
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
        },
    },
    { timestamps: true }
);

const Cart = mongoose.model('Cart', cartSchema);

module.exports ={
    Cart
}