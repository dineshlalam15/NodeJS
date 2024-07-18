import { asyncHandler } from "../utils/asyncHandler.js";
import { APIError } from "../utils/APIError.js";
import { APIResponse } from "../utils/APIResponse.js";
import User from '../models/user.model.js'
import {uploadOnCloudinary} from '../utils/cloudinary.js'

const registerUser = asyncHandler( async (req, res) => {
    const {fullName, email, userName, password} = req.body
    console.log(`${fullName}, ${email}, ${userName}, ${password}`);
    const details = [fullName, email, userName, password];
    details.forEach(detail => {
      if (!isEmpty(detail)) {
        throw new APIError(400, `${detail} is required`);
      }
    });
    if(!email.includes('@')){
        throw new APIError(400, `Invalid Email Id`)
    }
    const existedUserName = User.findOne({userName: userName})
    const existedEmail = User.findOne({email: email})
    if(existedUserName){
        throw new APIError(409, `username unavailable`)
    }
    if(existedEmail){
        throw new APIError(409, `User with this email already exist`)
    }

    const avatarLocalPath = req.files?.avatar[0]?.path
    const coverImageLocalPath = req.file?.coverImage[0]?.path
    if(!avatarLocalPath){
        throw new APIError(400, `Avatar file is required`)
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    if(!avatar){
        throw new APIError(400, `Avatar is required`)
    }

    const newUser = await User.create({
        fullName: fullName,
        avatar: avatar.url,
        coverImage: coverImage ? coverImage.url : "",
        email: email,
        userName: userName.toLowerCase() 
    })
    const createdUser = await User.findById(newUser._id).select("-password -refreshToken")
    if(!createdUser){
        throw new APIError(500, `Something went wrong while registering the user`)
    }

    return res.status(201).json(new APIResponse(200, createdUser, "User Registered Succesfully"))
})

function isEmpty(input){
    return input === ""
}

export {registerUser}