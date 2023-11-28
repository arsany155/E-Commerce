const slugify = require("slugify")
const {SubCategories , validateCreateSubCategory , validateUpdateSubCategory} = require("../models/SubCategoriesModel")
const asynchandler = require("express-async-handler")

/** 
* @desc     Get Sub Category 
* @route    /api/SubCategory
* @method   Get
* @access   public
*/ 
const getSubCategories = asynchandler(async(req,res) => {
    const {pageNumber} = req.query || 1;
    const {categoriesPerPage} = req.query || 1;

    let filterObject={}
    if(req.params.categoryID){
        filterObject={category: req.params.categoryID}
    }

    const Subcategorylist = await SubCategories.find(filterObject).skip((pageNumber -1)*categoriesPerPage).limit(categoriesPerPage).populate({path :"category" , select : "name -_id"})

    if (Subcategorylist){
        res.status(200).json({results: Subcategorylist.length , pageNumber ,data: Subcategorylist})
    }else {
        res.status(404).json({message:"Categories not found"})
    }
})

/** 
* @desc     Get SubCategory by id 
* @route    /api/SubCategory/:id
* @method   Get
* @access   public
*/ 
const getSubCategoryID = asynchandler(async(req,res) =>{
    const Subcategory = await SubCategories.findById(req.params.id)

    if (Subcategory){
        res.status(200).json(Subcategory)
    }else{
        res.status(404).json({message:"Category not found"})
    }
})

/** 
* @desc     Create new SubCategory 
* @route    /api/SubCategory
* @method   POST
* @access   private
*/
const CreateSubCategory = asynchandler(async(req,res) => {
    
    const { error } = validateCreateSubCategory(req.body)
    
        if(error){
            return res.status(400).json({message:error.details[0].message}) // 400 means the problem from client not server
        }

    const Subcategory = new SubCategories({
        name: req.body.name,
        slug: slugify(req.body.name),
        category: req.body.category
    })

    const result = await Subcategory.save()
    res.status(201).json(result)
})

/** 
* @desc     Update SubCategory 
* @route    /api/SubCategory/:id
* @method   PUT
* @access   private
*/
const UpdateSubCategory = asynchandler(async(req,res) => {
    const { error } = validateUpdateSubCategory(req.body)
    
        if(error){
            return res.status(400).json({message:error.details[0].message}) // 400 means the problem from client not server
        }
        
    const Subcategory = await SubCategories.findByIdAndUpdate(req.params.id , {
        $set: {
            name: req.body.name,
            slug: slugify(req.body.name),
            category: req.body.category 
        }
    }, {new: true}) 
    
    if (!Subcategory){
        res.status(404).json({msg: "Category not found"})
    }else{
        res.status(200).json(Subcategory)
    }
})

/**     
* @desc     Update  SubCategory 
* @route    /api/SubCategory/:id
* @method   Delete
* @access   private
*/
const DeleteSubCategory = asynchandler(async(req,res)=> {
    const Subcategory =  SubCategories.findById(req.params.id)

    if(Subcategory){
        await SubCategories.findByIdAndDelete(req.params.id)
        res.status(500).json({msg : "The Category Has been Deleted Successfully"})
    }else{
        res.status(404).json({msg: "Category not found"})
    }
})





module.exports= {
    getSubCategories,
    getSubCategoryID,
    CreateSubCategory,
    UpdateSubCategory,
    DeleteSubCategory
}
