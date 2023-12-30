const express = require("express")
const app =express()

const cors = require("cors");

const categoryPath = require("./routes/categoryRoute")
const SubcategoryPath = require("./routes/subCategoryRoute")
const BrandPath = require("./routes/brandRoute")
const ProductPath = require("./routes/productRoute")
const UserPath = require("./routes/userRoute")
const ReviewPath = require("./routes/reviewRoute")
const WishlistPath = require("./routes/wishlistRoute")
const AddressPath = require("./routes/addressRoute")
const CouponPath = require("./routes/couponRoute")
const CartPath = require("./routes/cartRoute")
const OrderPath = require("./routes/orderRoute")
const PayPalPath = require("./routes/paypal")

const morgan = require("morgan")
const connectTODB = require("./config/db")

const errors = require("./middlewares/errors")

const path = require("path")


//env
require("dotenv").config()

//connection to database
connectTODB()

if (process.env.NODE_ENV == 'development'){
    app.use(morgan('dev'))
    console.log(`mode: ${process.env.NODE_ENV}`) 
}

//Middlewares
app.use(express.json())
app.use(express.urlencoded({extended:true}))//3ashan how mesh by3rf el url ely gay men el view html
app.use(express.static(path.join(__dirname , "uploads"))) //for getting the images
app.use(cors({
    origin: 'http://localhost:8080',  // Replace with your Vue.js app's domain
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,  // Enable cookies and credentials for cross-origin requests
    optionsSuccessStatus: 204,  // Return a 204 status code for preflight requests
}));
    

//routes
app.use("/api/Categories",categoryPath)
app.use("/api/SubCategory",SubcategoryPath)
app.use("/api/Brand",BrandPath)
app.use("/api/Product",ProductPath)
app.use("/api/User",UserPath)
app.use("/api/Review",ReviewPath)
app.use("/api/Wishlist",WishlistPath)
app.use("/api/Address",AddressPath)
app.use("/api/Coupon",CouponPath)
app.use("/api/Cart",CartPath)
app.use("/api/Order",OrderPath)
// app.use("/api/check",PayPalPath)

// Error handler Middleware
app.use(errors.NotFound);
app.use(errors.errorhandler);

//Running the server
const Port = process.env.Port || 8000; 
const server = app.listen(Port , () => console.log(`server is runing ${Port}`))
