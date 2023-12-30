const asynchandler = require("express-async-handler")
const {User,validateUpdateUser , validateUpdatePassword} =require("../models/UserModel")
const bcrypt = require("bcryptjs")
const sharp =require("sharp") //require buffer so we use memoryStorage
const {uploadSingleImage} = require("../middlewares/uploadImages")




const UploadUserImage =uploadSingleImage('profileImage')

//for preprocessing image before storing in db
const resizeImage =asynchandler( async (req,res,next) => {
    if (!req.file) {
        return res.status(400).json({ message: 'File is not defined' });
    }

    const filename = `user-profile-${req.file.originalname}-${Date.now()}.jpeg`;
    await sharp(req.file.buffer)
        .resize(600,600)
        .toFormat('jpeg')
        .jpeg({quality: 95})
        .toFile(`uploads/UsersProfile/${filename}`)

        //to save the image in db
        req.body.profileImage = filename
    next();
})

/** 
* @desc     Get All Users
* @route    /api/users
* @method   GET
* @access   private (only Admin)
*/
const getUsers = asynchandler(async (req,res) => {
    const users = await User.find()

    if (users){
        res.status(200).json({results: users.length ,data: users})
    }else {
        res.status(404).json({message:"Categories not found"})
    }
})


/** 
* @desc     Get  User by id
* @route    /api/users/:id
* @method   GET
* @access   private (only Admin & user him self)
*/
const getUserbyId = asynchandler(async(req , res) => {
    var id = req.params.id
    if(!id){
        id = req.user._id
    }
    const user = await User.findById(id).select("-password")
    if(user){
        res.status(200).json(user)
    }else {
        res.status(400).json({message: "user not found"})
    }
})


/** 
* @desc     Update User
* @route    /api/users/:id
* @method   PUT
* @access   private
*/
const UpdateUser = asynchandler(async(req,res) => {
    const { error } = validateUpdateUser(req.body);

    if(error){
        return res.status(400).json({message:error.details[0].message})   
    }


    const updateUer = await User.findByIdAndUpdate(req.params.id ,{
        $set: {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            profileImage: req.body.profileImage,
            role: req.body.role,
        }
    }, {new: true})
    res.status(200).json(updateUer)
})


/** 
* @desc     Update User
* @route    /api/users/changePassword/:id
* @method   PUT
* @access   private
*/
const UpdateUserPassword = asynchandler(async(req,res) => {
    const {error} = validateUpdatePassword(req.body);
    if (error) {
        return res.status(400).json({message: error.details[0].message})
    }
    const user = await User.findById(req.params.id);
    if (!user) {
        return 'User not found';
    }

    const isPassword = await bcrypt.compare(req.body.currentPassword , user.password)
    if(!isPassword){
        return res.status(400).json({message: "invalid password , Please enter your old password"})
    }
    if(req.body.confirmPassword != req.body.password){
        return res.status(400).json({message: "the cofirm password doesn't match with the password"})
    }

    const usr = await User.findByIdAndUpdate(req.params.id ,{
        password: await bcrypt.hash(req.body.password , 12),
        passwordchangetime: Date.now()
    }, {new: true})
    res.status(200).json({msg : 'your password have been changed' , data: usr})
})



/** 
* @desc     delete User by id
* @route    /api/users/:id
* @method   DELETE
* @access   private (only Admin & user him self)
*/
const Deleteuser = asynchandler(async(req,res) => {
    const user = await User.findById(req.params.id)
    if(user){
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json({message: "the user has been deleted"})
    }else {
        res.status(400).json({message: "user not found"})
    }
})



module.exports={
    UploadUserImage,
    resizeImage,

    getUsers,
    getUserbyId,
    UpdateUser,
    UpdateUserPassword,
    Deleteuser
}