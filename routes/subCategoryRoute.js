const express = require("express")
const route = express.Router()
const {getSubCategories , getSubCategoryID , CreateSubCategory , UpdateSubCategory, DeleteSubCategory} = require("../Controllers/SubCategoryController")


route.get("/:categoryID/subcategories" , getSubCategories)
route.get("/:id" , getSubCategoryID)
route.post("/:categoryID/subcategories" , CreateSubCategory)
route.put("/:id" , UpdateSubCategory)
route.delete("/:id", DeleteSubCategory)


module.exports =route  