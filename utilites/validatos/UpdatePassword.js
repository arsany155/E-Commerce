const Joi = require('joi');  


async function validateUpdatePassword(obj, password) {
    const schema = Joi.object({
        currentPassword: Joi.string(),
        password: Joi.string().min(6),
        confirmPassword: Joi.string().custom((value, helpers) => {
            if (value !== obj.password) {
                return helpers.message('Passwords do not match');
            }
            return value;
        })
    }); 
    
    return schema.validate(obj);   
}
    const isCurrentPasswordValid = await bcrypt.compare(obj.currentPassword, password);
    
    if (!isCurrentPasswordValid) {
        return 'Current password is incorrect';
    }




module.exports={
    validateUpdatePassword
} 