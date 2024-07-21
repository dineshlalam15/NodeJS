import { asyncHandler } from "../utils/asyncHandler";
import dotenv from 'dotenv'
dotenv.config()
import User from "../models/user.model";
import jwt from 'jsonwebtoken'
import { APIError } from "../utils/APIError";

const verifyJWT = asyncHandler ( async (req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        if(!token){
            throw new APIError(401, `Unauthorized Request`)
        }
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const findUser = await User.findById(decodedToken?._id).select(" -password, -refreshToken")
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