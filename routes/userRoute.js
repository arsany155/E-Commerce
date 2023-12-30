const express = require("express")
const route = express.Router()
const { UploadUserImage, resizeImage,getUsers, getUserbyId, UpdateUser, UpdateUserPassword , Deleteuser} = require("../Controllers/UserController")
const { UploadUserProfileImage, resizeImageforuser,userRegistration , userLogin , forgetPassword , verifyPassCodeOtp ,ResetPassword}=require("../Controllers/AuthController")
const {verifyTokenandAutherization , verifyTokenandAdmin} =require("../middlewares/verifyToken")

route.post("/Register", UploadUserProfileImage, resizeImageforuser, userRegistration)
route.post("/Login" , userLogin)

// route.get("/" , verifyTokenandAdmin , getUsers)
route.get("/" ,verifyTokenandAutherization ,  getUserbyId)
route.put("/:id" ,verifyTokenandAutherization,UploadUserImage, resizeImage , UpdateUser)
route.put("/changePassword/:id" ,verifyTokenandAutherization, UpdateUserPassword)
route.delete("/:id",verifyTokenandAutherization, Deleteuser)


route.post("/forgetpassword" , forgetPassword)
route.post("/ResetCode" , verifyPassCodeOtp)
route.post("/ResetPassword" , ResetPassword)




module.exports =route   