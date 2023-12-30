const express = require("express")
const route = express.Router()
const {CreateCoupon , DeleteCoupon , UpdateCoupon , getCouponID , getCoupons} = require("../Controllers/CouponController")
const{ verifyTokenandAdmin}=require("../middlewares/verifyToken")


route.get("/" , verifyTokenandAdmin , getCoupons)
route.get("/:id" , verifyTokenandAdmin , getCouponID)
route.post("/" , verifyTokenandAdmin  , CreateCoupon)
route.put("/:id" , verifyTokenandAdmin , UpdateCoupon)
route.delete("/:id", verifyTokenandAdmin , DeleteCoupon)


module.exports =route   