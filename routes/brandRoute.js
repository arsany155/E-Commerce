const express = require("express")
const route = express.Router()
const {UploadBrandImage, resizeImage , getBrands , getBrandID , CreateBrand , UpdateBrand, DeleteBrand} = require("../Controllers/BrandController")


route.get("/" , getBrands)
route.get("/:id" , getBrandID)
route.post("/" , UploadBrandImage, resizeImage , CreateBrand)
route.put("/:id" , UploadBrandImage, resizeImage , UpdateBrand)
route.delete("/:id", DeleteBrand)


module.exports =route   