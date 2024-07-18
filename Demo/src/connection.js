import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import app from './app.js'

const port = process.env.PORT || 8000

function connectServer(){
    try{
        app.listen(port, () => {
            console.log(`Application started on PORT ${port}`)
    })
    } catch (error){
        console.log(`Connection Error ${error}`)
        throw error
    }
}

export default connectServer