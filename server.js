const express = require("express")
const app =express()

const categoryPath = require("./routes/categoryRoute")
const SubcategoryPath = require("./routes/subCategoryRoute")
const BrandPath = require("./routes/brandRoute")
const ProductPath = require("./routes/productRoute")
const UserPath = require("./routes/userRoute")

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
app.use(express.urlencoded({extended:false}))//3ashan how mesh by3rf el url ely gay men el view html
app.use(express.static(path.join(__dirname , "uploads"))) //for getting the images


//routes
app.use("/api/Categories",categoryPath)
app.use("/api/SubCategory",SubcategoryPath)
app.use("/api/Brand",BrandPath)
app.use("/api/Product",ProductPath)
app.use("/api/User",UserPath)

// Error handler Middleware
app.use(errors.NotFound);
app.use(errors.errorhandler);


//Running the server
const Port = process.env.Port || 8000; 
const server = app.listen(Port , () => console.log(`server is runing ${Port}`))


//Events ==> listion ==> callback(err)
//handle errors outside express
process.on('unhandledRejection' , (err) => {
    console.error(`UnhandledRejection Errors:${err.name} | ${err.message}`)
    server.close(()=>{
        console.error(`Shutting down`)
        process.exit(1)
    })
})