const express = require("express")
const route = express.Router()
const { UploadUserImage, resizeImage,getUsers, getUserbyId, UpdateUser, UpdateUserPassword , Deleteuser} = require("../Controllers/UserController")
const { UploadUserProfileImage, resizeImageforuser,userRegistration}=require("../Controllers/AuthController")


route.post("/Register", UploadUserProfileImage, resizeImageforuser, userRegistration)
// route.post("/Login")

route.get("/" , getUsers)
route.get("/:id" , getUserbyId)
route.put("/:id" ,UploadUserImage, resizeImage , UpdateUser)
route.put("/changePassword/:id" , UpdateUserPassword)
route.delete("/:id", Deleteuser)


module.exports =route   