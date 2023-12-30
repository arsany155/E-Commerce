const slugify = require("slugify")
const {Product,validateCreateProduct, validateUpdateProduct} = require("../models/ProductsModel")
const asynchandler = require("express-async-handler")
const {Categories} = require("../models/CategoriesModel")
const {SubCategories} = require("../models/SubCategoriesModel")
const apiFeatures = require("../utilites/apiFeatures")
const sharp =require("sharp") //require buffer so we use memoryStorage
const {Review} =require("../models/ReviewsModel")
const { mongoose } = require('mongoose')



const {uploadArrayImage} = require("../middlewares/uploadImages")





const uploadarray = uploadArrayImage()
//for preprocessing image before storing in db
const resizeImage =asynchandler( async (req,res,next) => {

    //preprocessing for image cover
    if (req.files.imagecover) {
        const imagecoverfilename = `product-${req.files['imagecover'][0].originalname}-${Date.now()}cover.jpeg`;
        await sharp(req.files.imagecover[0].buffer)
            .resize(2000, 1300)
            .toFormat('jpeg')
            .jpeg({ quality: 95 })
            .toFile(`uploads/Products/${imagecoverfilename}`);
        // to save the image in db
        req.body.imagecover = imagecoverfilename;
    }

    req.body.images = [];

    // preprocessing for images
    if (req.files.images) {
        const images = req.files.images;
        const promiseArray = [];
    
        for (let index = 0; index < images.length; index++) {
            const img = images[index];
            const imagename = `product-${img.originalname}-${Date.now()}-${index + 1}.jpeg`;
    
            const promise = sharp(img.buffer)
                .resize(2000, 1300)
                .toFormat('jpeg')
                .jpeg({ quality: 95 })
                .toFile(`uploads/Products/${imagename}`)
                .then(() => {
                    // to save the image in db
                    req.body.images.push(imagename);
                });
    
            promiseArray.push(promise);
        }
    
        await Promise.all(promiseArray);
    }
    
    next()
})








/** 
* @desc     Get all Products 
* @route    /api/Products   
* @method   Get
* @access   public
*/ 
const getProducts = asynchandler(async (req, res) => {
        const countDocuments = await Product.countDocuments()
        // Build query for pagination
        const apifeaturs = new apiFeatures(Product.find() , req.query).filter().search().sort().pagination(countDocuments)
        
        const {paginationResult} = apifeaturs
        // Execute the query
        const Productslist = await apifeaturs.mongoose;

        if (Productslist) {
            res.status(200).json({ results: Productslist.length, paginationResult , data: Productslist });
        } else {
            res.status(404).json({ message: "Products not found" });
        }
    
});



/** 
* @desc     Get Product by id 
* @route    /api/Product/:id    
* @method   Get
* @access   public
*/ 
const getProductID = asynchandler(async(req,res) =>{
    let query =  Product.findById(req.params.id)
    if('reviews'){
        query = query.populate('reviews')
    }
    const productt =await query
    if (!productt){
        res.status(404).json({message:"Product not found"})
        return  
    }

    const result = await Review.aggregate([
        {
            $match: {
                product: new mongoose.Types.ObjectId(req.params.id),
            }
        },
        {
            $group: {
                _id: '$product', 
                avgRatings: { $avg: '$ratings' },
                ratingQuantity: { $sum: 1 },
            }
        }
    ]);

        if (result.length > 0) {
            productt.ratingsAverage = result[0].avgRatings;
            productt.ratingQuantity = result[0].ratingQuantity;
        } else {
            productt.ratingsAverage = 0;
            productt.ratingQuantity = 0;
        }
    
        // Save the updated product
        await productt.save();
    
        res.status(200).json(productt)
})


/** 
* @desc     Create new Product 
* @route    /api/Product
* @method   POST
* @access   private
*/
const CreateProduct = asynchandler(async(req,res) => {
    //validate the rest of the inputs
    const { error } = validateCreateProduct(req.body)
        if(error){
            return res.status(400).json({message:error.details[0].message}) // 400 means the problem from client not server
        }

    //make only the slug alone     
    req.body.slug = slugify(req.body.title)

    //validate the category id check if it exist or not in database
    const category = await Categories.findById(req.body.category)
    if(!category){
        res.json({msg : "category id not found"})
    } 

    //validate the subcategories id check if they exist or not
    if(req.body.subcategories){
    const subcategoryIdsToCheck = req.body.subcategories;
    for (const subcategoryId of subcategoryIdsToCheck) {
        const subcategory = await SubCategories.findById(subcategoryId);
        if (!subcategory) {
            return res.json({ msg: `Subcategory with ID ${subcategoryId} not found` });
        }
    }
}


    //check the subcategory from inputs are from the category or not 
    if(req.body.subcategories){
        const subcategoryIds = req.body.subcategories;
        for (const subcategoryId of subcategoryIds) {
            
            const subcategory = await SubCategories.findById(subcategoryId).populate({path :"category" , select : "_id"});
            if (!subcategory || !subcategory.category || subcategory.category._id.toString() !== req.body.category) {
                return res.json({ msg: `Subcategory with ID ${subcategoryId} is not associated with the specified category` });
            }
        }
    }

        //check if the data exist in the database or not 
        const { title, description } = req.body;
        const existingProduct = await Product.findOne({ title, description, category });

        if (existingProduct) {
            return res.json({ msg: 'Product already exists in the database' });
        }


        //to save the new Product
        const product = await Product.create(req.body)
        res.status(201).json(product)
})

/** 
* @desc     Update Product 
* @route    /api/Product/:id
* @method   PUT
* @access   private
*/
const UpdateProduct = asynchandler(async(req,res) => {
    const { error } = validateUpdateProduct(req.body)
    
        if(error){
            return res.status(400).json({message:error.details[0].message}) // 400 means the problem from client not server
        }
        
        if(req.body.title){
            req.body.slug = slugify(req.body.title)
        }

    const product = await Product.findByIdAndUpdate(req.params.id ,req.body, {new: true}) 
    
    if (!product){
        res.status(404).json({msg: "Product not found"})
    }else{
        res.status(200).json(product)
    }
})

/**     
* @desc     Update Product 
* @route    /api/Product/:id
* @method   Delete
* @access   private
*/
const DeleteProduct = asynchandler(async(req,res)=> {
    const product = Product.findById(req.params.id)

    if(product){
        await Product.findByIdAndDelete(req.params.id)
        res.status(500).json({msg : "The Product Has been Deleted Successfully"})
    }else{
        res.status(404).json({msg: "Product not found"})
    }
})



module.exports= {
    uploadarray,
    resizeImage,

    getProducts,
    getProductID,
    CreateProduct,
    UpdateProduct,
    DeleteProduct
}