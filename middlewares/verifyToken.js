const jwt = require("jsonwebtoken")
const{User} = require("../models/UserModel")

async function verifyToken(req , res, next){
    const token =req.headers.token
    if(token){  
        try {
            const decoded = jwt.verify(token , process.env.JWT_SECRET_KEY);

            const currentuser = await User.findById(decoded.id)

            if(!currentuser){
                res.json({msg: "user not found"})
            }

            if(currentuser.passwordchangetime){
                const passchangeTimeStamp = parseInt(currentuser.passwordchangetime.getTime() / 1000 , 10)
                if(passchangeTimeStamp > decoded.iat){
                    res.json({msg: "please login again"})
                }
            }

            next()
        } catch (error) {
            res.status(401).json({message: "invalid token"})
        }

    }else {
        res.status(401).json({message: "no token found"})
    }    
    
}



module.exports={
    verifyToken
}