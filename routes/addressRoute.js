const express = require("express")
const route = express.Router()
const { CreateAddresses, RemoveAddresses, GetAddresses} = require("../Controllers/AddressesController")
const {verifyTokenAndUser} = require("../middlewares/verifyToken")


route.post("/" , verifyTokenAndUser , CreateAddresses)
route.delete("/:addressId" , verifyTokenAndUser , RemoveAddresses)
route.get("/" , verifyTokenAndUser , GetAddresses)








module.exports =route 