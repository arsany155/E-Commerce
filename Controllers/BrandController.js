const slugify = require("slugify")
const {Brand,validateCreateBrand, validateUpdateBrand} = require("../models/BrandsModel")
const asynchandler = require("express-async-handler")



const sharp =require("sharp") //require buffer so we use memoryStorage
const {uploadSingleImage} = require("../middlewares/uploadImages")





const UploadBrandImage =uploadSingleImage('image')

//for preprocessing image before storing in db
const resizeImage =asynchandler( async (req,res,next) => {
    if (!req.file) {
        return res.status(400).json({ message: 'File is not defined' });
    }

    const filename = `brand-${req.file.originalname}-${Date.now()}.jpeg`;
    await sharp(req.file.buffer)
        .resize(600,600)
        .toFormat('jpeg')
        .jpeg({quality: 95})
        .toFile(`uploads/Brands/${filename}`)

        //to save the image in db
        req.body.image = filename
    next();
})






/** 
* @desc     Get all Brands 
* @route    /api/Brands
* @method   Get
* @access   public
*/ 
const getBrands = asynchandler(async(req,res) => {
    const {pageNumber} = req.query || 1;
    const {BrandsPerPage} = req.query || 1;

    const Brandslist = await Brand.find().skip((pageNumber -1)*BrandsPerPage).limit(BrandsPerPage)

    if (Brandslist){
        res.status(200).json({results: Brandslist.length , pageNumber ,data: Brandslist})
    }else {
        res.status(404).json({message:"Brands not found"})
    }
})

/** 
* @desc     Get Brand by id 
* @route    /api/Brand/:id
* @method   Get
* @access   public
*/ 
const getBrandID = asynchandler(async(req,res) =>{
    const brand = await Brand.findById(req.params.id)

    if (brand){
        res.status(200).json(brand)
    }else{
        res.status(404).json({message:"brand not found"})
    }
})

/** 
* @desc     Create new Brand 
* @route    /api/Brand
* @method   POST
* @access   private
*/
const CreateBrand = asynchandler(async(req,res) => {
    const { error } = validateCreateBrand(req.body)
    
        if(error){
            return res.status(400).json({message:error.details[0].message}) // 400 means the problem from client not server
        }

    const brand = await Brand.create(req.body)
    res.status(201).json(brand)
})

/** 
* @desc     Update Brand 
* @route    /api/Brand/:id
* @method   PUT
* @access   private
*/
const UpdateBrand = asynchandler(async(req,res) => {
    const { error } = validateUpdateBrand(req.body)
    
        if(error){
            return res.status(400).json({message:error.details[0].message}) // 400 means the problem from client not server
        }
        
    const brand = await Brand.findByIdAndUpdate(req.params.id , {
        $set: {
            name: req.body.name,
            slug: slugify(req.body.name)
        }
    }, {new: true}) 
    
    if (!brand){
        res.status(404).json({msg: "brand not found"})
    }else{
        res.status(200).json(brand)
    }
})

/**     
* @desc     Update Brand 
* @route    /api/Brand/:id
* @method   Delete
* @access   private
*/
const DeleteBrand = asynchandler(async(req,res)=> {
    const brand =  Brand.findById(req.params.id)

    if(brand){
        await Brand.findByIdAndDelete(req.params.id)
        res.status(500).json({msg : "The brand Has been Deleted Successfully"})
    }else{
        res.status(404).json({msg: "brand not found"})
    }
})





module.exports= {

    UploadBrandImage,
    resizeImage,

    getBrands,
    getBrandID,
    CreateBrand,
    UpdateBrand,
    DeleteBrand
}