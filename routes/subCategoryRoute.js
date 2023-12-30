const express = require("express")
const route = express.Router()
const {getSubCategories , getSubCategoryID , CreateSubCategory , UpdateSubCategory, DeleteSubCategory} = require("../Controllers/SubCategoryController")
const{ verifyTokenandAutherization, verifyTokenandAdmin}=require("../middlewares/verifyToken")


route.get("/:categoryID/subcategories" , verifyTokenandAutherization , getSubCategories)
route.get("/:id" , verifyTokenandAutherization , getSubCategoryID)
route.post("/:categoryID/subcategories" , verifyTokenandAdmin , CreateSubCategory)
route.put("/:id" , verifyTokenandAdmin , UpdateSubCategory)
route.delete("/:id", verifyTokenandAdmin , DeleteSubCategory)


module.exports =route  