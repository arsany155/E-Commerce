const express = require("express")
const route = express.Router()
const {index  , PayByPayPall , cancel , success} = require("../Controllers/OrderController")

route.get("/" , index)
route.post("/pay", PayByPayPall)
route.get("/success" , success)
route.get("/cancel" , cancel)

module.exports = route
