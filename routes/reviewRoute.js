const express = require("express")
const route = express.Router()
const {CreateReview , DeleteReview ,UpdateReview , getReviewID , getReviews}=require("../Controllers/ReviewController")
const {verifyTokenAndUser , verifyTokenandAutherization}=require("../middlewares/verifyToken")

route.get("/:id"  , getReviews)
route.get("/:id"  , getReviewID)
route.post("/"  , verifyTokenAndUser , CreateReview)
route.put("/:id"  , verifyTokenAndUser , UpdateReview)
route.delete("/:id" , verifyTokenandAutherization , DeleteReview)

module.exports = route
