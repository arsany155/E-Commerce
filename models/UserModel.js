const mongoose = require("mongoose");
const Joi = require('joi');  
const passwordcomplexity = require("joi-password-complexity")
const JoiPhoneNumber = require('joi-phone-number');


const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength:100,
        minlength:2 
    },
    email: {
        type: String,
        required: true,
        unique: [true , "the email already exist"],
        trim: true,
    },
    phone: {
        type: String
    },
    profileImage: {
        type: String
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength:6
    },
    passwordchangetime:{
        type: Date
    },
    role: {
        type: String,
        enum: ["user","manager","admin"],
        default: "user"
    },
    active: {
        type: String,
        default: true
    }
}, {timestamps:true})



//Validate Register User
function validateRegisterUser(obj){
    const schema = Joi.object({
        name: Joi.string().min(2).max(100).required(),
        email: Joi.string().trim().required().email(),
        // phone:  JoiPhoneNumber().optional(),
        password: passwordcomplexity().required().min(6),
        confirmPassword: Joi.string().custom((value, helpers) => {
            if (value !== obj.password) {
                return helpers.message('Passwords do not match');
            }
            return value;
        })
        .required(),
        profileImage: Joi.string().optional(),
        role: Joi.string().optional()
    });
    return schema.validate(obj) 
}


async function validateUpdatePassword(obj) {
    const schema = Joi.object({
        currentPassword: Joi.string().required(),
        password: Joi.string().min(6).required(),
        confirmPassword: Joi.string().required()
    }); 
    
    return schema.validate(obj);   
}



//works in update , get all , get one
UserSchema.post('init', function(doc){
    if(doc.profileImage){
        const imageURL = `${process.env.Base_URL}/UserProfile/${doc.profileImage}`
        doc.profileImage= imageURL
    }
})
//this one for when creating new category 
UserSchema.post('save', function(doc){
    if(doc.profileImage){
        const imageURL = `${process.env.Base_URL}/UserProfile/${doc.profileImage}`
        doc.profileImage= imageURL
    }
})




//Validate Login User
function validateLoginUser(obj){
    const schema = Joi.object({
        email: Joi.string().trim().required().email(),
        password: Joi.string().trim().min(6).required(),
    });
    return schema.validate(obj) 
}


//Validate change password user  forget password
function validateChangePassword(obj){
    const schema = Joi.object({
        password: Joi.string().trim().min(6).required(),
    });
    return schema.validate(obj) 
}
    
//Validate Update User
function validateUpdateUser(obj){
    const schema = Joi.object({
        email: Joi.string().trim().email().optional(),
        name: Joi.string().trim().min(2).max(100).optional(),
        // phone: Joi.when('locale', {
        //     is: Joi.valid('ar-eg', 'ar-sa'),
        //     then: JoiPhoneNumber().eg().optional(),
        //     otherwise: JoiPhoneNumber().optional(),
        // }),
        profileImage: Joi.string().optional(),
        role: Joi.string().optional(),
        active: Joi.string().optional()
    });
    return schema.validate(obj) 
}




const User = mongoose.model("User" , UserSchema)


module.exports={
    User,
    validateLoginUser,
    validateRegisterUser,
    validateUpdateUser,
    validateChangePassword,
    validateUpdatePassword
}