const asynchandler = require("express-async-handler")
const bcrypt = require("bcryptjs")
const jwt =require("jsonwebtoken")
const { User, validateLoginUser, validateRegisterUser} = require("../models/UserModel")
const sharp =require("sharp") //require buffer so we use memoryStorage
const {uploadSingleImage} = require("../middlewares/uploadImages")
const crypto = require("crypto")
const {sendEmail} = require("../utilites/sendEmail")


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
    const token = jwt.sign({id : result._id } , process.env.JWT_SECRET_KEY);
    res.status(201).json({data: result , token})
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
    const token = jwt.sign({id : user._id} , process.env.JWT_SECRET_KEY);
        res.status(200).json({data: user , token})
})




/** 
* @desc     forget user Password
* @route    /api/auth/forgetPassword
* @method   POST
* @access   public
*/
const forgetPassword = asynchandler(async(req,res) => {
    // 1) get user by email
    const user =await User.findOne({email: req.body.email})
    if(!user){
        res.json({msg: "user not found"})
    }

    // 2) create a random number of 6-digits and save it in db
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString()
    const hashedResetCode = crypto
    .createHash('sha256')
    .update(resetCode)
    .digest('hex')

    user.passwordResetCode = hashedResetCode
    user.passwordResetExpire = Date.now() + 10 * 60 * 1000
    user.passwordResetVerified = false
    await user.save()
    
    try {
        // 3) send email
        await sendEmail({
            res,
            email: user.email, 
            message: `Hi ${user.name}. \n We  received a request to reset the password , here is the reset code \n ${resetCode} \n type this otp number  in verification`
        })
    } catch (error) {     
        user.passwordResetCode = undefined
        user.passwordResetExpire = undefined
        user.passwordResetVerified = undefined
        await user.save()
        return "there is error in sending email "
    }

    res.json({msg: "Reset code sent  to email"})
})



/** 
* @desc     forget user Password
* @route    /api/auth/VerifyPassCode
* @method   POST
* @access   public
*/
const verifyPassCodeOtp = asynchandler(async(req,res) => {
    const hashedResetCode = crypto
    .createHash('sha256')
    .update(req.body.resetCode)
    .digest('hex')
    
    const user = await User.findOne({passwordResetCode: hashedResetCode })
    if(!user){
        res.json({msg: "Reset Code is invalid"})
    }

    user.passwordResetVerified= true
    await user.save()
    res.json({msg:"success"})
})




/** 
* @desc     Reset user Password
* @route    /api/auth/ResetPassword
* @method   PUT
* @access   public
*/
const ResetPassword = asynchandler(async(req, res) => {
    const user = await User.findOne({email: req.body.email})
    if(!user){
        res.json({msg: "user not found"})
    }

    if(!user.passwordResetVerified){
        res.json({msg: "Reset code is not verified"})
    }
     //crypt the password
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password , salt) 

    user.password = req.body.password
    user.passwordResetCode = undefined
    user.passwordResetExpire = undefined
    user.passwordResetVerified = undefined
    await user.save()

    const token = jwt.sign({id : user._id} , process.env.JWT_SECRET_KEY);
    res.status(200).json({token}) 
})









module.exports={
    UploadUserProfileImage,
    resizeImageforuser,
    userRegistration,
    userLogin,


    forgetPassword,
    verifyPassCodeOtp,
    ResetPassword
}