import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {createUser} from "../services/user.service.js";
import {validationResult} from "express-validator"
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";


// ------------Register User--------------------------------//

const userRegister = asyncHandler(async(req, res, next)=>{

// if anything goes wrong while checking in route then it is passed through req in validation result
    const errors  = validationResult(req)
    console.log("Here are the errors, ",errors);
    
    // errors is an array of all the validation errors
    if(!errors.isEmpty()){
         const formattedErrors = errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }));
    
      throw new ApiError(422, "Validation failed", formattedErrors);
    }
    // console.log("Here is the req Body",req.body);
    
    const {fullname, email, password} = req.body;
    const hashedPassword = await User.hashPassword(password);
    const user = await createUser({
        firstname: fullname?.firstname,
        lastname: fullname?.lastname,
        email,
        password: hashedPassword
    });
    console.log("User create: ", user);
    
    const token  = user.generateAuthToken();
    console.log("Token create",token);
    
       return res.status(201).json(
        new ApiResponse(200, {token, user}, "User registered Successfully")
    )
})



export {userRegister}