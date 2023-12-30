const asynchandler = require("express-async-handler")
const {User} =require("../models/UserModel")

/** 
* @desc     post a wishlist
* @route    /api/users
* @method   POST
* @access   private (only user)
*/
const CreateWishList = asynchandler(async (req, res) => {
    const user = await User.findByIdAndUpdate(
        req.user._id,
        { $addToSet: { wishlist: req.body.productId } },
        { new: true } 
    );

    res.json({ msg: "Product added successfully", data: user.wishlist });
});




/** 
* @desc     delete a wishlist/:product id
* @route    /api/users
* @method   DELETE
* @access   private (only user)
*/
const RemoveWishList = asynchandler(async (req, res) => {
    const user = await User.findByIdAndUpdate(
        req.user._id,
        { $pull: { wishlist: req.params.productId } },
        { new: true } 
    );

    res.json({ msg: "Product removed successfully", data: user.wishlist });
});



/** 
* @desc     get a wishlist/:product id
* @route    /api/users
* @method   GET
* @access   private (only user)
*/
const GetWishList = asynchandler(async (req, res) => {
    const user = await User.findById(req.user._id).populate("wishlist");

    res.json({ data: user.wishlist });
});



module.exports = {
    CreateWishList,
    RemoveWishList,
    GetWishList
}