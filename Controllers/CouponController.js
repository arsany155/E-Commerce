const {Coupon} = require("../models/CouponModel")
const asynchandler = require("express-async-handler")




/** 
* @desc     Get all Coupons 
* @route    /api/Coupons
* @method   Get
* @access   public
*/ 
const getCoupons = asynchandler(async(req,res) => {
    const Couponslist = await Coupon.find()

    if (Couponslist){
        res.status(200).json({results: Couponslist.length ,data: Couponslist})
    }else {
        res.status(404).json({message:"Coupons not found"})
    }
})

/** 
* @desc     Get Coupon by id 
* @route    /api/Coupon/:id
* @method   Get
* @access   public
*/ 
const getCouponID = asynchandler(async(req,res) =>{
    const coupon = await Coupon.findById(req.params.id)

    if (coupon){
        res.status(200).json(coupon)
    }else{
        res.status(404).json({message:"Coupon not found"})
    }
})

/** 
* @desc     Create new Coupon 
* @route    /api/Coupon
* @method   POST
* @access   private
*/
const CreateCoupon = asynchandler(async(req,res) => {
    // const { error } = validateCreateCoupon(req.body)
    
    //     if(error){
    //         return res.status(400).json({message:error.details[0].message}) // 400 means the problem from client not server
    //     }

    const coupon = await Coupon.create(req.body)
    res.status(201).json(coupon)
})

/** 
* @desc     Update Coupon 
* @route    /api/Coupon/:id
* @method   PUT
* @access   private
*/
const UpdateCoupon = asynchandler(async(req,res) => {
    const { error } = validateUpdateCoupon(req.body)
    
        if(error){
            return res.status(400).json({message:error.details[0].message}) // 400 means the problem from client not server
        }
        
    const coupon = await Coupon.findByIdAndUpdate(req.params.id , {
        $set: {
            name: req.body.name,
            slug: slugify(req.body.name)
        }
    }, {new: true}) 
    
    if (!coupon){
        res.status(404).json({msg: "Coupon not found"})
    }else{
        res.status(200).json(coupon)
    }
})

/**     
* @desc     Update Coupon 
* @route    /api/Coupon/:id
* @method   Delete
* @access   private
*/
const DeleteCoupon = asynchandler(async(req,res)=> {
    const coupon =  Coupon.findById(req.params.id)

    if(coupon){
        await coupon.findByIdAndDelete(req.params.id)
        res.status(500).json({msg : "The Coupon Has been Deleted Successfully"})
    }else{
        res.status(404).json({msg: "Coupon not found"})
    }
})





module.exports= {
    getCoupons,
    getCouponID,
    CreateCoupon,
    UpdateCoupon,
    DeleteCoupon
}