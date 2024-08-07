import { asyncHandler } from "../utils/asyncHandler.js";
import { APIError } from "../utils/APIError.js";
import { APIResponse } from "../utils/APIResponse.js";
import {User, generateRefreshToken, generateAccessToken} from '../models/user.model.js'
import {uploadOnCloudinary} from '../utils/cloudinary.js'
import { isEmpty, validateEmail, validatePassword, validateUsername } from "../validation.js";
import jwt from 'jsonwebtoken'

const generateRefreshAndAccessTokens = async(userId) => {
    const findUser = await User.findById(userId)
    const refreshToken = generateRefreshToken(findUser)
    const accessToken = generateAccessToken(findUser)
    findUser.refreshToken = refreshToken
    await findUser.save({validateBeforeSave: false})
    return {refreshToken, accessToken}
}

const registerUser = asyncHandler(async(req, res) => {
    const {fullName, email, userName, password} = req.body
    const details = [fullName, email, userName, password]
    details.forEach(element => {
        if(isEmpty(element)){
            throw new APIError(400, `${element} is required`)
        }
    })
    if(!validateEmail(email)){
        throw new APIError(400, `Invalid email`)
    }
    if(!validateUsername(userName)){
        throw new APIError(400, `userName ${userName} not available`)
    }
    if(!validatePassword(password)){
        throw new APIError(400, `password doesn't satisfy the security requirements`)
    }

    const existedUserName = await User.findOne({userName: userName})
    const existedEmail = await User.findOne({email: email})
    if(existedUserName){
        throw new APIError(400, `userName unavailable`)
    }
    if(existedEmail){
        throw new APIError(400, `User with the email ${email} already exist`)
    }

    const avatarLocalPath = req.files?.avatar[0]?.path
    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }
    if(!avatarLocalPath){
        throw new APIError(400, `Please upload the avatar`)
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    if(!avatar){
        throw new APIError(400, `avatar is required`)
    }

    const newUser = await User.create({
        userName: userName.toLowerCase(),
        fullName: fullName,
        email: email,
        password: password,
        avatar: avatar.url,
        coverImage: coverImage ? coverImage.url : ""
    })
    const createdUser = await User.findById(newUser._id).select("-password, -refreshToken")
    if(!createdUser){
        throw new APIError(500, `Something went wrong while registering the user`)
    }

    return res.status(201).json(new APIResponse(200, createdUser, "User Registered Succesfully"))
})

const loginUser = asyncHandler(async(req, res)  => {
    const {userName, email, password} = req.body
    if(!userName && !email){
        throw new APIError(400, `Please enter a valid email or userName`)
    }

    const findUser = await User.findOne({
        $or: [
            {userName}, 
            {email}
        ]
    })
    if(!findUser){
        throw new APIError(404, `User with this email or userName doesn't exist`)
    }

    const checkPassword = await findUser.isPasswordCorrect(password)
    if(!checkPassword){
        throw new APIError(401, `Incorrect password`)
    }

    const {refreshToken, accessToken} = await generateRefreshAndAccessTokens(findUser._id)
    const findLoggedInUser = await User.findById(findUser._id).select("-password, -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("refreshToken", refreshToken, options)
    .cookie("accessToken", accessToken, options)
    .json(new APIResponse(
        200, 
        {
            user: findLoggedInUser, refreshToken, accessToken
        }, 
        "user logged in successfully" )
    )
})

const logoutUser = asyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(req.user._id, {
        $set: {
            refreshToken: undefined
        }
    }, {new: true})

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new APIResponse(200, {}, "User logged out"))
})

const refreshAccessToken = asyncHandler( async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
    if(!incomingRefreshToken) {
        throw new APIError(401, `unauthorized request`)
    }
    try{
        const decodedInfo = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
        const findUser = await User.findById(decodedInfo?._id)
        if(!findUser){
            throw new APIError(401, `Invalid refresh token`)
        }
        if(incomingRefreshToken !== findUser?.refreshToken){
            throw new APIError(401, `Refresh Token is expired or used`)
        }
        const {newRefreshToken, accessToken} = await generateRefreshAndAccessTokens(findUser)
        const options = {
            httpOnly: true,
            secure: true
        }
        return res
        .status(200)
        .clearCookie("accessToken", accessToken, options)
        .clearCookie("refreshToken", newRefreshToken, options)
        .json(new APIResponse(200, 
            {accessToken, refreshToken: newRefreshToken},
            "Access token refreshed" )
        )
    } catch(error){
        throw new APIError(401, error?.message || `Invalid Refresh Token`)
    }
})

const changeCurrentPassword = asyncHandler( async (req, res) => {
    const {oldPassword, newPassword, confirmPassword} = req.body
    if(newPassword !== confirmPassword){
        throw new APIError(401, `New Password and Confirm Password should be same`)
    }
    const findUser = await User.findById(req.user._id)
    const isPasswordCorrect = await findUser.isPasswordCorrect(oldPassword)
    if(!isPasswordCorrect){
        throw new APIError(401, `Old Password is incorrect`)
    }
    if(!validatePassword(newPassword)){
        throw new APIError(400, `Password seem's not safe. Try it again`)
    }
    findUser.password = newPassword || confirmPassword
    await findUser.save({ validateBeforeSave: false })
    return res.status(200)
    .json(new APIResponse(200, {}, `Password is changed`))
})

const getCurrentUser = asyncHandler( async(req, res) => {
    return res.status(200).json(new APIResponse(200, req.user, "User details fetched successfully"))
})

const updateUserDetails = asyncHandler( async (req, res) => {
    const {userName, fullName, email} = req.body
    try{
        const findUser = await User.findById(req.user._id)
        if(userName){
            if(isEmpty(userName)){
                throw new APIError(400, `userName can't be empty`)
            } 
            const existedUserName = await User.findOne({userName: userName})
            if(existedUserName){
                throw new APIError(400, `userName unavailable`)
            }
            findUser.userName = userName
        }

        if(email){
            if(isEmpty(email)){
                throw new APIError(400, `email is required`)
            }
            const existedEmail = await User.findOne({email: email})
            if(existedEmail){
                throw new APIError(400, `User with this email already exist`)
            }
            findUser.email = email
        }

        if(fullName){
            if(isEmpty(fullName)){
                throw new APIError(400, `fullName can't be empty`)
            } 
            findUser.fullName = fullName
        }

        let avatarLocalPath
        let coverImageLocalPath
        if (req.files && Array.isArray(req.files.avatar) && req.files.avatar.length > 0) {
            avatarLocalPath = req.files.avatar[0].path
        }
        if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
            coverImageLocalPath = req.files.coverImage[0].path
        }

        let avatar
        let coverImage
        if(avatarLocalPath){
            avatar = await uploadOnCloudinary(avatarLocalPath)
        }
        if(coverImageLocalPath){
            coverImage = await uploadOnCloudinary(coverImageLocalPath)
        }

        findUser.avatar = avatar ? avatar.url : findUser.avatar
        findUser.coverImage = coverImage ? coverImage.url : findUser.coverImage
        await findUser.save({ validateBeforeSave: false })
        return res.status(200).json(
            new APIResponse(
                200, 
                findUser,
                "User details updated successfully"
            )
        )
    } catch(error){
        throw new APIError( 500, `Cannot update details right now. Please try later`, error )
    }
})


export {
    registerUser, 
    loginUser, 
    logoutUser, 
    refreshAccessToken, 
    changeCurrentPassword, 
    getCurrentUser, 
    updateUserDetails
}