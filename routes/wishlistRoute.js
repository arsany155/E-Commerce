const express = require("express")
const route = express.Router()
const {CreateWishList , RemoveWishList , GetWishList} = require("../Controllers/WishListController")
const {verifyTokenAndUser} = require("../middlewares/verifyToken")


route.post("/" , verifyTokenAndUser , CreateWishList)
route.delete("/:productId" , verifyTokenAndUser , RemoveWishList)
route.get("/" , verifyTokenAndUser , GetWishList)








module.exports =route 