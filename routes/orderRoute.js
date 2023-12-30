const express = require("express")
const route = express.Router()
const {createCashOrder , getOrderbyid , getOrders , UpdateOrdertoDeliver , UpdateOrdertoPaid } = require("../Controllers/OrderController")
const{ verifyTokenAndUser , verifyTokenandAutherization , verifyTokenandAdmin}=require("../middlewares/verifyToken")


route.post("/:id" , verifyTokenAndUser , createCashOrder)
route.get("/" , verifyTokenandAutherization , getOrders)
route.get("/:id" , verifyTokenAndUser , getOrderbyid)
route.put("/:id/pay" , verifyTokenandAdmin , UpdateOrdertoPaid)
route.put("/:id/deliver" , verifyTokenandAdmin , UpdateOrdertoDeliver )

module.exports = route
