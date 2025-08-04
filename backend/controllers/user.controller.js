import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {createUser} from "../services/user.service.js";
import {validationResult} from "express-validator"
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { BlackListedToken } from "../models/blacklistToken.model.js";


// ------------Register User--------------------------------//

const userRegister = asyncHandler(async(req, res)=>{

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

//-----------------------Login User----------------------------------//

const userLogin = asyncHandler(async(req, res)=>{
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
    const {email, password} = req.body;
    console.log("Email and Password", email, password);
    
    const user = await User.findOne({email}).select('+password') // because by default we have set not to send password
    console.log("Here is the user", user);
    
    if(!user){
        throw new ApiError(401,"User not found!")
    }
    const isMatch = await user.comparePassword(password);
    console.log(("Is Matched", isMatch));
    
    if(!isMatch){
        throw new ApiError(401, "Invalid password")
    }
    const token = user.generateAuthToken()
 const options = {
// The cookie cannot be accessed via JavaScript in the browser (e.g., document.cookie).
// ✅ This helps prevent XSS attacks, that's why httpOnly: true .
    httpOnly: true,
// The cookie is only sent over HTTPS (not HTTP).
// This prevents the cookie from being sent over an unencrypted connection
    secure: true
}
//  So you're saying: "Only send this cookie in secure environments, 
// and don't let JavaScript touch it.
   return res
    .status(200)
    .cookie("Token", token, options)
    .json(
        new ApiResponse(
            200, 
            {
                user: user, token
            },
            "User logged In Successfully"
        )
    )

})

//--------------------Logout User-----------------------------//
const userLogout = asyncHandler(async (req, res) => {
    const token = req.cookies?.Token|| req.header("Authorization")?.replace("Bearer ","")
    res.clearCookie("Token", {
        httpOnly: true,
        secure: true,
        sameSite: "strict"
    });
    await BlackListedToken.create({token})
    return res.status(200).json(
        new ApiResponse(200, null, "User logged out successfully")
    );
});

//--------------------get User profile-----------------------------//
const getUserProfile = async (req, res)=>{

    res.status(201).json(req.user);
}
export {
    userRegister,
    userLogin,
    getUserProfile,
    userLogout
}