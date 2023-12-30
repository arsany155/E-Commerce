const asynchandler = require("express-async-handler")
const {Cart}=require("../models/CartModel")
const {Product}=require("../models/ProductsModel")
const {Coupon} =require("../models/CouponModel")



/** 
* @desc     Add product to cart 
* @route    /api/Cart   
* @method   POST    
* @access   public
*/ 
const CreateCart = asynchandler(async (req, res) => {
    const { productId, color } = req.body;
    
    // Check if the user has any carts
    let carts = await Cart.find({ user: req.user._id });

    const product = await Product.findById(productId);

    if (!carts || carts.length === 0) {
        // If the user doesn't have any carts, create a new one
        const cart = await Cart.create({
            user: req.user._id,
            cartItems: [{ product: productId, color, price: product.price }],
        });

        let totalPrice = 0;
        cart.cartItems.forEach((item) => {
        totalPrice += item.quantity * item.price;
        });
        cart.totalCartPrice = totalPrice;
        res.json({ msg: "Product added to your new cart", data: cart });
        return;
    }

    // Use the first cart found (you might want to add more logic to select a specific cart)
    const cart = carts[0]

    // Check if the product already exists in the cart, update the quantity
    const findIndex = cart.cartItems.findIndex((item) => item.product.toString() === productId && item.color === color)

    if (findIndex > -1) {
        const cartItem = cart.cartItems[findIndex];
        cartItem.quantity += 1;
        cart.cartItems[findIndex] = cartItem;
    } else {
        // Push the product to cartItems array
        cart.cartItems.push({ product: productId, color, price: product.price });
    }

    let totalPrice = 0;
    cart.cartItems.forEach((item) => {
        totalPrice += item.quantity * item.price;
    });
    cart.totalCartPrice = totalPrice;

    await cart.save();
    res.json({ msg: "Product added to your cart", data: cart });
});



/** 
* @desc     remove product to cart 
* @route    /api/Cart   
* @method   Delete    
* @access   public
*/ 
const getCart = asynchandler(async(req,res) => {
    const cart = await Cart.findOne({user: req.user._id})

    if(!cart){
        res.json({msg: "there is no items in the cart"})
    }else{
        res.json(cart)
    }

})




/** 
* @desc     remove product to cart 
* @route    /api/Cart   
* @method   Delete    
* @access   public
*/
const removeitem = asynchandler(async(req,res) => {
    const cart = await Cart.findOneAndUpdate(
        {user: req.user._id},
        {$pull: {cartItems: {_id: req.params.id}}},
        {new: true}
    )

    let totalPrice = 0;
    cart.cartItems.forEach((item) => {
        totalPrice += item.quantity * item.price;
    })
    cart.totalCartPrice = totalPrice;
    await cart.save();
    res.json(cart)
})



/** 
* @desc     remove product to cart 
* @route    /api/Cart   
* @method   Delete    
* @access   public
*/
const clearCart = asynchandler(async(req,res) => {
    const clear = await Cart.findOneAndDelete({user : req.user._id})
    res.json({msg: "your cart is empty" })
})


/** 
* @desc     remove product to cart 
* @route    /api/Cart   
* @method   Delete    
* @access   public
*/
const updateItemQuantity = asynchandler(async (req, res) => {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        res.json({ msg: "There is no cart" });
        return;
    }

    const itemIndex = cart.cartItems.findIndex((item) => item._id.toString() === req.params.id);

    if (itemIndex > -1) {
        const cartItem = cart.cartItems[itemIndex];
        cartItem.quantity = quantity;
        cart.cartItems[itemIndex] = cartItem;
    }

    let totalPrice = 0;
    cart.cartItems.forEach((item) => {
        totalPrice += item.quantity * item.price;
    });

    cart.totalCartPrice = totalPrice;
    await cart.save();

    res.json({ msg: "Success", data: cart });
});




const applyCoupon = asynchandler(async (req, res, next) => {
    // 1) Get coupon based on coupon name
    const coupon = await Coupon.findOne({
        name: req.body.coupon,
        // expire: { $gt: Date.now() },
        });
    
        if (!coupon) {
        return next(new ApiError(`Coupon is invalid or expired`));
        }
    
        // 2) Get logged user cart to get total cart price
        const cart = await Cart.findOne({ user: req.user._id });
        const totalPrice = cart.totalCartPrice;

        // 3) Calculate price after priceAfterDiscount
        const totalAfterDiscount = ( totalPrice - (totalPrice * coupon.discount) / 100 ).toFixed(2); // 99.23    
        console.log(totalAfterDiscount)
        cart.totalPriceAfterDiscount = totalAfterDiscount;
        await cart.save();

        res.status(200).json({numOfCartItems: cart.cartItems.length  , data: cart});
});





module.exports={
    getCart,
    CreateCart,
    removeitem,
    clearCart,
    updateItemQuantity,
    applyCoupon
}