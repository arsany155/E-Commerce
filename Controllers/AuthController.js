const asynchandler = require("express-async-handler")
const bcrypt = require("bcryptjs")
const jwt =require("jsonwebtoken")
const { User, validateLoginUser, validateRegisterUser} = require("../models/UserModel")
const sharp =require("sharp") //require buffer so we use memoryStorage
const {uploadSingleImage} = require("../middlewares/uploadImages")




const UploadUserProfileImage =uploadSingleImage('profileImage')

//for preprocessing image before storing in db
const resizeImageforuser =asynchandler( async (req,res,next) => {
    if (req.file) {
    const filename = `user-profile-${req.file.originalname}-${Date.now()}.jpeg`;
    await sharp(req.file.buffer)
        .resize(600,600)
        .toFormat('jpeg')
        .jpeg({quality: 95})
        .toFile(`uploads/UsersProfile/${filename}`)
        //to save the image in db
        req.body.profileImage = filename
    }
    next();
})





/** 
* @desc     Register new User
* @route    /api/auth/register
* @method   POST
* @access   public
*/
const userRegistration = asynchandler(async(req,res)=>{
    //validate the input 
    const {error} = validateRegisterUser(req.body);
    if (error){
        return res.status(400).json({message : error.details[0].message})
    }
    
    // checking in database
    let user = await User.findOne({email: req.body.email})
    if(user){
        return res.status(400).json({message: "This user has been registered already"})
    }
    
    //crypt the password
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password , salt) 

    // save the inputs in the database
    const result = await User.create(req.body)
    // const token = jwt.sign({id : user._id , isAdmin: user.isAdmin} , process.env.JWT_SECRET_KEY);
    // const { password, ...other }=result._doc
        res.status(201).json(result)
})



/** 
* @desc     Login User
* @route    /api/auth/login
* @method   POST
* @access   public
*/
const userLogin = asynchandler(async(req,res)=>{
    //validate the input 
    const {error} = validateLoginUser(req.body);
    if (error){
        return res.status(400).json({message : error.details[0].message})
    }

    // checking the email in database
    let user = await User.findOne({email: req.body.email }) 
    if(!user){
        return res.status(400).json({message: "invalid email or password"})
    }

    const isPassword = await bcrypt.compare(req.body.password , user.password)
    if(!isPassword){
        return res.status(400).json({message: "invalid email or password"})
    }

    // save the inputs in the database
    const token = jwt.sign({id : user._id , isAdmin: user.isAdmin} , process.env.JWT_SECRET_KEY);
    const { password, ...other }=user._doc
        res.status(200).json({...other , token})
})

module.exports={
    UploadUserProfileImage,
    resizeImageforuser,
    userRegistration,
    userLogin
}