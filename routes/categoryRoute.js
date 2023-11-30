const express = require("express")
const route = express.Router()
const {UploadCategoryImage, resizeImage , getCategories , getCategoryID , CreateCategory , UpdateCategory, DeleteCategory} = require("../Controllers/CategoryController")
const{verifyToken}=require("../middlewares/verifyToken")



route.get("/" , getCategories)
route.get("/:id" , getCategoryID)
route.post("/" ,verifyToken, UploadCategoryImage, resizeImage ,CreateCategory)
route.put("/:id" ,UploadCategoryImage, resizeImage , UpdateCategory)
route.delete("/:id", DeleteCategory)


module.exports =route   