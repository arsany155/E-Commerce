const slugify = require("slugify")
const {Categories , validateCreateCategory , validateUpdateCategory} = require("../models/CategoriesModel")
const asynchandler = require("express-async-handler")
const sharp =require("sharp") //require buffer so we use memoryStorage
const {uploadSingleImage} = require("../middlewares/uploadImages")





const UploadCategoryImage =uploadSingleImage('image')

//for preprocessing image before storing in db
const resizeImage =asynchandler( async (req,res,next) => {
    const filename = `category-${req.file.originalname}-${Date.now()}.jpeg`;
    await sharp(req.file.buffer)
        .resize(600,600)
        .toFormat('jpeg')
        .jpeg({quality: 95})
        .toFile(`uploads/categories/${filename}`)

        //to save the image in db
        req.body.image = filename
    next();
})










/** 
* @desc     Get all Categories 
* @route    /api/Categories
* @method   Get
* @access   public
*/ 
const getCategories = asynchandler(async(req,res) => {
    const {pageNumber} = req.query || 1;
    const {categoriesPerPage} = req.query || 1;

    const categorieslist = await Categories.find().skip((pageNumber -1)*categoriesPerPage).limit(categoriesPerPage)

    if (categorieslist){
        res.status(200).json({results: categorieslist.length , pageNumber ,data: categorieslist})
    }else {
        res.status(404).json({message:"Categories not found"})
    }
})

/** 
* @desc     Get Category by id 
* @route    /api/Category/:id
* @method   Get
* @access   public
*/ 
const getCategoryID = asynchandler(async(req,res) =>{
    const category = await Categories.findById(req.params.id)

    if (category){
        res.status(200).json(category)
    }else{
        res.status(404).json({message:"Category not found"})
    }
})

/** 
* @desc     Create new Category 
* @route    /api/Category
* @method   POST
* @access   private
*/
const CreateCategory = asynchandler(async(req,res) => {
    const { error } = validateCreateCategory(req.body)
    
        if(error){
            return res.status(400).json({message:error.details[0].message}) // 400 means the problem from client not server
        }
        req.body.slug = slugify(req.body.name)
    const category = await Categories.create(req.body)
    res.status(201).json(category)
})

/** 
* @desc     Update Category 
* @route    /api/Category/:id
* @method   PUT
* @access   private
*/
const UpdateCategory = asynchandler(async(req,res) => {
    const { error } = validateUpdateCategory(req.body)
    
        if(error){
            return res.status(400).json({message:error.details[0].message}) // 400 means the problem from client not server
        }
        
    const category = await Categories.findByIdAndUpdate(req.params.id , {
        $set: {
            name: req.body.name,
            slug: slugify(req.body.name)
        }
    }, {new: true}) 
    
    if (!category){
        res.status(404).json({msg: "Category not found"})
    }else{
        res.status(200).json(category)
    }
})

/**     
* @desc     Update Category 
* @route    /api/Category/:id
* @method   Delete
* @access   private
*/
const DeleteCategory = asynchandler(async(req,res)=> {
    const category =  Categories.findById(req.params.id)

    if(category){
        await Categories.findByIdAndDelete(req.params.id)
        res.status(500).json({msg : "The Category Has been Deleted Successfully"})
    }else{
        res.status(404).json({msg: "Category not found"})
    }
})





module.exports= {

    UploadCategoryImage,
    resizeImage,

    getCategories,
    getCategoryID,
    CreateCategory,
    UpdateCategory,
    DeleteCategory
}