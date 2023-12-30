const express = require("express")
const route = express.Router()
const {UploadBrandImage, resizeImage , getBrands , getBrandID , CreateBrand , UpdateBrand, DeleteBrand} = require("../Controllers/BrandController")
const{ verifyTokenandAutherization, verifyTokenandAdmin}=require("../middlewares/verifyToken")


route.get("/" , verifyTokenandAutherization , getBrands)
route.get("/:id" , verifyTokenandAutherization , getBrandID)
route.post("/" , verifyTokenandAdmin , UploadBrandImage, resizeImage , CreateBrand)
route.put("/:id" , verifyTokenandAdmin , UploadBrandImage, resizeImage , UpdateBrand)
route.delete("/:id", verifyTokenandAdmin , DeleteBrand)


module.exports =route   