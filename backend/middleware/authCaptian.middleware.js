import { Captian } from "../models/captian.model.js";
import jwt from "jsonwebtoken"
import { ApiError } from "../utils/ApiError.js";
import { BlackListedToken } from "../models/blacklistToken.model.js";
const authCaptain = async(req, res, next)=>{
  const token = req.cookies?.Token|| req.header("Authorization")?.replace("Bearer ","")

    if(!token) throw new ApiError(401,"Unauthorised Access")
    const isBlacklisted = await BlackListedToken.findOne({ token: token });
  if (isBlacklisted) {
     return res.status(401).json({ message: 'Unauthorized' });
    }

try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const captian = await Captian.findById(decodedToken._id);
    req.captian = captian;
    return next();
} catch (error) {
    throw new ApiError(401, "Error Accessing Token")
}

}


export default authCaptain ;