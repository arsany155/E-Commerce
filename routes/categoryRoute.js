const express = require("express")
const route = express.Router()
const {UploadCategoryImage, resizeImage , getCategories , getCategoryID , CreateCategory , UpdateCategory, DeleteCategory} = require("../Controllers/CategoryController")
const{ verifyTokenandAutherization, verifyTokenandAdmin}=require("../middlewares/verifyToken")



route.get("/" ,verifyTokenandAutherization, getCategories)
route.get("/:id" , verifyTokenandAutherization , getCategoryID)
route.post("/" , verifyTokenandAdmin , UploadCategoryImage, resizeImage ,CreateCategory)
route.put("/:id" , verifyTokenandAdmin ,UploadCategoryImage, resizeImage , UpdateCategory)
route.delete("/:id", verifyTokenandAdmin , DeleteCategory)


module.exports =route   