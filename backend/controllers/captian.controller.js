import { validationResult } from "express-validator";
import { Captian } from "../models/captian.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import createCaptian from "../services/captian.service.js";


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

export {registerCaptian}