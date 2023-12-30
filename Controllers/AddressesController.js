const asynchandler = require("express-async-handler")
const {User} =require("../models/UserModel")

/** 
* @desc     post a new Adresses
* @route    /api/users
* @method   POST
* @access   private (only user)
*/
const CreateAddresses = async (req, res) => {
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { $addToSet: { addresses: req.body } },
            { new: true }
        );
        res.json({ msg: "Address added successfully", data: user.addresses });
};





/** 
* @desc     delete a Addresses/:address id
* @route    /api/users
* @method   DELETE
* @access   private (only user)
*/
const RemoveAddresses = asynchandler(async (req, res) => {
    const user = await User.findByIdAndUpdate(
        req.user._id,
        { $pull: { addresses: {_id: req.params.addressId } } },
        { new: true } 
    );

    res.json({ msg: "address removed successfully", data: user.addresses });
});



/** 
* @desc     get a addresses/:product id
* @route    /api/users
* @method   GET
* @access   private (only user)
*/
const GetAddresses = asynchandler(async (req, res) => {
    const user = await User.findById(req.user._id).populate("addresses");
    res.json({ data: user.addresses });
});



module.exports = {
    CreateAddresses,
    RemoveAddresses,
    GetAddresses
}