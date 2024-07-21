import {Schema, model} from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
dotenv.config();

const userSchema = new Schema({
    userName: {
        type: String,
        required: true,
        unique:true,
        lowercase: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique:true,
        lowercase: true,
        trim: true,
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    avatar: {
        type: String,
        required: true
    },
    coverImage: {
        type: String
    },
    watchHistory: {
        type: Schema.Types.ObjectId,
        ref: "Video"
    },
    refreshToken: {
        type: String,
    }
}, {timestamps: true})

userSchema.pre("save", async function(next){ // can't use callbacks because function needs a context.
    if(!this.isModified("password")){
        return next()
    }
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function (password){
    return await bcrypt.compare(password, this.password)
}

function generateRefreshToken(user){
    const payload = {
        _id: user._id
    }
    const secretKey = process.env.REFRESH_TOKEN_SECRET
    const options = {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
    const jwtToken = jwt.sign(payload, secretKey, options)
    return jwtToken
}

function generateAccessToken(user){
    const payload = {
        _id: user._id
    }
    const secretKey = process.env.ACCESS_TOKEN_SECRET
    const options = {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
    const jwtToken = jwt.sign(payload, secretKey, options)
    return jwtToken
}
const User = model('User', userSchema)

export {User, generateRefreshToken, generateAccessToken}