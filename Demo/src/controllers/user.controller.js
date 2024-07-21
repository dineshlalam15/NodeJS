import { asyncHandler } from "../utils/asyncHandler.js";
import { APIError } from "../utils/APIError.js";
import { APIResponse } from "../utils/APIResponse.js";
import User from '../models/user.model.js'
import {uploadOnCloudinary} from '../utils/cloudinary.js'
import { isEmpty, validateEmail, validatePassword, validateUsername } from "../validation.js";

const generateRefreshAndAccessTokens = async(userId) => {
    const findUser = await User.findById(userId)
    const refreshToken = await findUser.generateRefreshToken()
    const accessToken = await findUser.generateAccessToken()
    findUser.refreshToken = refreshToken
    return {refreshToken, accessToken}
}

const registerUser = asyncHandler( async (req, res) => {
    const {fullName, email, userName, password} = req.body
    console.log(`${fullName}, ${email}, ${userName}, ${password}`);
    const details = [fullName, email, userName, password];
    details.forEach(element => {
        if(isEmpty(element)){
            throw new APIError(400, `${element} is required`)
        }
    })
    if(!validateEmail(email)){
        throw new APIError(400, `Invalid Email Id`)
    }
    if(!validateUsername(userName)){
        throw new APIError(400, `${userName} not available`)
    }
    if(!validatePassword(password)){
        throw new APIError(400, `Password seem's not safe. Try it again`)
    }
    const existedUserName = await User.findOne({userName: userName})
    const existedEmail = await User.findOne({email: email})
    if(existedUserName){
        throw new APIError(409, `username unavailable`)
    }
    if(existedEmail){
        throw new APIError(409, `User with this email already exist`)
    }
    const avatarLocalPath = req.files?.avatar[0]?.path
    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }
    if(!avatarLocalPath){
        throw new APIError(400, `Avatar file is required`)
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    if(!avatar){
        throw new APIError(400, `Avatar is required`)
    }
    const newUser = await User.create({
        userName: userName.toLowerCase(),
        fullName: fullName,
        email: email,
        password: password,
        avatar: avatar.url,
        coverImage: coverImage.url || "",
    })
    const createdUser = await User.findById(newUser._id).select(
        "-password -refreshToken"
    )
    if(!createdUser){
        throw new APIError(500, `Something went wrong while registering the user`)
    }
    return res.status(201).json(new APIResponse(200, createdUser, "User Registered Succesfully"))
})

const loginUser = asyncHandler( async (req, res)  => {
    const {userName, email, password} = req.body
    if(!userName || !email){
        throw new APIError(400, `Please enter username or email`)
    }
    const findUser = await User.findOne( { $or: [ { userName: userName }, { email : email } ] } )
    if(!findUser){
        throw new APIError(404, `Account with this email or user name doesn't exist`)
    }
    const checkPassword = await findUser.isPasswordCorrect(password)
    if(!checkPassword){
        throw new APIError(401, `Incorrect Password`)
    }
    const {refreshToken, accessToken} = await generateRefreshAndAccessTokens(findUser._id)
    const findLoggedInUser = await User.findById(findUser._id).select("-password, -refreshToken")
    const options = {
        httpOnly: true,
        secure: true
    }
    return res
    .status(200)
    .cookie("Refresh Token", refreshToken, options)
    .cookie("Access Token", accessToken, options)
    .json(new APIResponse(
        200, 
        {
            user: findLoggedInUser, refreshToken, accessToken
        }, 
        "user logged in successfully" )
    )
})
export {registerUser}