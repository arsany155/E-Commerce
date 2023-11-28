const express = require("express")
const route = express.Router()
const {uploadarray,resizeImage,getProducts, getProductID , CreateProduct , UpdateProduct, DeleteProduct} = require("../Controllers/ProductController")


route.get("/" , getProducts)
route.get("/:id" , getProductID)
route.post("/" , uploadarray, resizeImage, CreateProduct)
route.put("/:id" , uploadarray, resizeImage,  UpdateProduct)
route.delete("/:id", DeleteProduct)


module.exports =route   