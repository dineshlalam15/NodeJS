import dotenv from 'dotenv'
dotenv.config()
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import jwt from 'jsonwebtoken'
import { APIError } from "../utils/APIError.js";

const verifyJWT = asyncHandler ( async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        if(!token){
            throw new APIError(401, `Unauthorized Request`)
        } 
        const decodedInfo = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const findUser = await User.findById(decodedInfo?._id).select(" -password, -refreshToken")
        if(!findUser){
            throw new APIError(401, `Invalid Access Token`)
        }
        req.user = findUser
        next()
    } catch (error) {
        throw new APIError(401, error?.message || "Invalid Access Token")
    }
})

export {verifyJWT}