import { validationResult } from "express-validator";
import { Captian } from "../models/captian.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import createCaptian from "../services/captian.service.js";
import { BlackListedToken } from "../models/blacklistToken.model.js";


const registerCaptian = asyncHandler(async (req, res)=>{
    // if anything goes wrong while checking in route then it is passed through req in validation result
    const errors  = validationResult(req)
    
    // errors is an array of all the validation errors
    console.log("Here is the error", errors);
    
    if(!errors.isEmpty()){
         const formattedErrors = errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }));
    
      throw new ApiError(422, "Validation failed", formattedErrors);
    }
    const {fullname, email, password, vehicle} = req.body;
    const isCaptianAlreadyExist = await Captian.findOne({email});
    if(isCaptianAlreadyExist){
        throw new ApiError(400, "This email already is in used")
    }

    const hashedPassword = await Captian.hashPassword(password)
    const captian = await createCaptian({
        firstname : fullname?.firstname,
        lastname : fullname?.lastname,
        email,
        password: hashedPassword,
        color: vehicle?.color,
        plate: vehicle?.plate,
        capacity: vehicle?.capacity,
        vehicleType: vehicle?.vehicleType,

    })
    const token = captian.generateAuthToken();
    res.status(201).json(new ApiResponse(201, {captian, token}, "Captian Registered Successfully"))

})

//------------Login----------------------------------------------------//

const loginCaptian = asyncHandler(async(req, res)=>{
    const {email, password} = req.body;
    if(!email || !password){
        throw new ApiError(400, "Please Enter Valid Email or Password")
    }
    const captian = await Captian.findOne({ email }).select('+password');
    if(!captian){
        throw new ApiError(400,"Email Not Found")
    }
    const isValidPassword = await captian.comparePassword(password)
    if(!isValidPassword){
        throw new ApiError(400, "Invalid Password")
    }
    const token = captian.generateAuthToken();
    const options = {
    httpOnly: true,
    secure: false // set to false for local development
    }
   return res
    .status(200)
    .cookie("Token", token, options)
    .json(
        new ApiResponse(
            200, 
            {
                captian: captian, token
            },
            "Captian logged In Successfully"
        )
    )


})

const getCaptianProfile = asyncHandler(async(req, res)=>{
    return res.status(200).json(
        new ApiResponse(200, req.captian, "Captain profile retrieved successfully")
    );
})

const logoutCaptain  = asyncHandler(async(req,res)=>{
       const token = req.cookies?.Token|| req.header("Authorization")?.replace("Bearer ","")
       console.log("Here is the token", token);
       
       res.clearCookie("Token", {
           httpOnly: true,
           secure: true,
           sameSite: "strict"
       });
       await BlackListedToken.create({token})
       return res.status(200).json(
           new ApiResponse(200, null, "Captian logged out successfully")
       );
   });

export {
    registerCaptian,
    loginCaptian,
    getCaptianProfile,
    logoutCaptain
}