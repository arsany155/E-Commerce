const multer = require("multer") //for handle the image while uploading
const { Error } = require("mongoose")


const uploadSingleImage = (fieldname) => {
    const multerStorage = multer.memoryStorage()

    const multerFilter = function (req, file, cb) { //for checking the inout must be image only 
        if (file.mimetype.startsWith('image')) {
            cb(null, true);
        } else {
            const error = new Error("Must be an image");
            error.statusCode = 400; 
            cb(error, false);
        }
    };
    const upload= multer({storage: multerStorage , fileFilter: multerFilter})
    return upload.single(fieldname)

}



const uploadArrayImage = () => {
    const multerStorage = multer.memoryStorage()

    const multerFilter = function (req, file, cb) { //for checking the inout must be image only 
        if (file.mimetype.startsWith('image')) {
            cb(null, true);
        } else {
            const error = new Error("Must be an image");
            error.statusCode = 400; 
            cb(error, false);
        }
    };
    const upload= multer({storage: multerStorage , fileFilter: multerFilter})
    return upload.fields([
        { name: 'imagecover' , maxCount: 1 } ,
        { name: 'images' , maxCount: 5 }
    ])
}


module.exports={
    uploadSingleImage,
    uploadArrayImage
}