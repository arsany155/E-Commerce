const slugify = require("slugify")
const {Review , validatePostReview , validateUpdateReview} = require("../models/ReviewsModel")
const asynchandler = require("express-async-handler")


/** 
* @desc     Get all reviews 
* @route    /api/Reviews
* @method   Get
* @access   public
*/ 
const getReviews = asynchandler(async(req,res) => {
    const Reviewslist = await Review.find({product : req.params.id})

    if (Reviewslist){
        res.status(200).json({results: Reviewslist.length ,data: Reviewslist})
    }else {
        res.status(404).json({message:"Reviews not found"})
    }
})

/** 
* @desc     Get Review by id 
* @route    /api/Review/:id
* @method   Get
* @access   public
*/ 
const getReviewID = asynchandler(async(req,res) =>{
    const review = await Review.findById(req.params.id)

    if (review){
        res.status(200).json(review)
    }else{
        res.status(404).json({message:"Review not found"})
    }
})


/** 
* @desc     Create new Review 
* @route    /api/Review
* @method   POST
* @access   private
*/
const CreateReview = asynchandler(async(req,res) => {
        if (!req.body.user) req.body.user = req.user._id;
        const { error } = validatePostReview(req.body)
        if(error){
            return res.status(400).json({message:error.details[0].message}) // 400 means the problem from client not server
        }

            const find = await Review.findOne({user: req.body.user , product: req.body.product })
            if(find){
                res.json({msg: "you are already comment on this product before"})
            }else{
                const review = await Review.create(req.body)
                res.status(201).json(review)
            }
})


/** 
* @desc     Update Review 
* @route    /api/Review/:id
* @method   PUT     
* @access   private
*/
const UpdateReview = asynchandler(async (req, res) => {
    const { error } = validateUpdateReview(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const foundReview = await Review.findById(req.params.id);
    if (String(foundReview.user._id) !== String(req.user._id)) {
        return res.status(404).json({ msg: "you are not allowed to update this review" });
    }

    const updatedReview = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updatedReview) {
        return res.status(404).json({ msg: "Review not found" });
    } else {
        return res.status(200).json(updatedReview);
    }
});


/**     
* @desc     Update Review 
* @route    /api/Review/:id
* @method   Delete
* @access   private
*/
const DeleteReview = asynchandler(async(req,res)=> {
    const review =  Review.findById(req.params.id)

    if(review){
        await Review.findByIdAndDelete(req.params.id)
        res.status(500).json({msg : "The Review Has been Deleted Successfully"})
    }else{
        res.status(404).json({msg: "Review not found"})
    }
})





module.exports= {
    getReviews,
    getReviewID,
    CreateReview,
    UpdateReview,
    DeleteReview
}