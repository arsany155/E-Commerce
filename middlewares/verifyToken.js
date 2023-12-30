const jwt = require("jsonwebtoken")
const{User} = require("../models/UserModel")

async function verifyToken(req, res, next) {
    if (req.headers.token) {
        try {
            const decoded = jwt.verify(req.headers.token, process.env.JWT_SECRET_KEY);
            const currentuser = await User.findById(decoded.id);

            if (!currentuser) {
                res.json({ msg: "user not found" });
            }
            //for change password not forget password
            if (currentuser.passwordchangetime) {
                const passchangeTimeStamp = parseInt(currentuser.passwordchangetime.getTime() / 1000, 10);
                if (passchangeTimeStamp > decoded.iat) {
                    res.json({ msg: "please login again" });
                }
            }

            req.user = currentuser;
            next();
        } catch (error) {
            res.status(401).json({ message: "invalid token" });
        }
    } else {
        res.status(401).json({ message: "no token found, please login" });
    }
}


function verifyTokenandAutherization (req,res,next){
    verifyToken(req,res, ()=>{
        const allowedRoles = ["admin", "manager" , "user"] ;
        if (allowedRoles.includes(req.user.role)){
            next()
        }else {
            return res.status(403).json({message: "you are not allowed"})
        }
    })
}


//verify token & Admin
function verifyTokenandAdmin(req,res,next){
    verifyToken(req,res, ()=>{
        const allowedRoles = ["admin", "manager"] ;
        if (allowedRoles.includes(req.user.role)){
            next()
        }else {
            return res.status(403).json({message: "you are not allowed , only admin are allowed"})
        }
    })
}


async function verifyTokenAndUser(req, res, next) {
    verifyToken(req, res, () => {
        if (req.user.role === "user") {
            next();
        } else {
            return res.status(403).json({ message: "you are not allowed" });
        }
    });
}








module.exports={
    verifyToken,
    verifyTokenandAutherization,
    verifyTokenandAdmin,
    verifyTokenAndUser
}