const express = require("express")
const route = express.Router()
const {uploadarray,resizeImage,getProducts, getProductID , CreateProduct , UpdateProduct, DeleteProduct} = require("../Controllers/ProductController")
const{ verifyTokenandAutherization, verifyTokenandAdmin}=require("../middlewares/verifyToken")


route.get("/"  , getProducts)
route.get("/:id"  , getProductID)
route.post("/" , verifyTokenandAdmin , uploadarray, resizeImage, CreateProduct)
route.put("/:id" , verifyTokenandAdmin , uploadarray, resizeImage,  UpdateProduct)
route.delete("/:id", verifyTokenandAdmin , DeleteProduct)


module.exports =route   