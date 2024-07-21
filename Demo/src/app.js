import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import userRouter from './routes/user.router.js'

const app = express()

app.use(cors())

app.use(express.json())
app.use(express.urlencoded({extended: true, limit: '16kb'}));
app.use(express.static("public")) 
app.use(cookieParser())

app.use("/api/v1/users", userRouter)

export default app