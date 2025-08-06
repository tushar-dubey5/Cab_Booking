import { User } from "../models/user.model.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { ApiError } from "../utils/ApiError.js";
import { BlackListedToken } from "../models/blacklistToken.model.js";
const authUser = async(req, res, next)=>{
  const token = req.cookies?.Token|| req.header("Authorization")?.replace("Bearer ","")
  console.log("Hello FrontEnd, ",token);
  
    if(!token) throw new ApiError(401,"Unauthorised Access")
    const isBlacklisted = await BlackListedToken.findOne({ token: token });
  if (isBlacklisted) {
     return res.status(401).json({ message: 'Unauthorized' });
    }

try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decodedToken._id);
    req.user = user;
    return next();
} catch (error) {
    throw new ApiError(401, "Error Accessing Token")
}

}


export default authUser;