import express from 'express'
import dotenv from 'dotenv'
dotenv.config()

const app = express()
const port = process.env.PORT || 4000
const connectServer = async() => {
    try{
        await app.listen(port, () => [
            console.log(`Application started on PORT ${port}`)
        ])
    } catch (error){
        console.log(`Connection Error ${error}`)
        throw error
    }
}

export default connectServer