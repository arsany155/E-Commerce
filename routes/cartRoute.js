const express = require("express")
const route = express.Router()
const {getCart , CreateCart , removeitem , clearCart , updateItemQuantity , applyCoupon} = require("../Controllers/CartController")
const{ verifyTokenAndUser}=require("../middlewares/verifyToken")


route.post("/" , verifyTokenAndUser , CreateCart)
route.get("/" , verifyTokenAndUser , getCart)
route.delete("/:id" , verifyTokenAndUser , removeitem)
route.delete("/" , verifyTokenAndUser , clearCart)
route.put("/:id" , verifyTokenAndUser , updateItemQuantity)
    
route.put("/" , verifyTokenAndUser , applyCoupon)


module.exports =route   