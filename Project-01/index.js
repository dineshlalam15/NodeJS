const express = require('express')
const fs = require('fs')
const users = require('./MOCK_DATA.json')
const e = require('express')
const port = 8000
const app = express()

// Middleware - Plugin
app.use(express.urlencoded({extended: false}))

app.route("/users/:id")
.get((req, res) => {
    const id = Number(req.params.id)
    const user = users.find(element => element.id === id)
    if(user != null){
        return res.json(user)
    } else{
        return res.send(`User with id ${id} doesn't exist`)
    }
})
.put((req,res) => {
    return res.json({Status: "Pending"})
})
.patch((req,res) => {
    const body = req.body
    const id = Number(req.params.id)
    const index = users.findIndex(element => element.id === id)
    if(index != -1){
        const updatedUserDetails = {
            id: id,
            first_name: body.first_name,
            last_name: body.last_name,
            email: body.email,
            gender: body.gender,
            job_title: body.job_title
        }
        users[index] = updatedUserDetails
        fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err) => {
            if(err){
                res.send(`Error: ${err}`)
            } else{
                return res.json({Status: "Succesfully Changed", id: id})
            }
        })
    } else{
        res.send(`User with id ${id} doesn't exist. Action can't be performed`)
    }
    
})
.delete((req,res) => {
    const id = Number(req.params.id)
    const index = users.findIndex(element => element.id === id);
    if (index !== -1) {
        users.splice(index, 1);
        fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err) => {
            if(err){
                res.send(`ERROR: ${err}`)
            } else{
                res.json({Status: "Succesfully Deleted", id: id})
            }
        })
    } else{
        return res.send(`User with id number ${id} doesn't exist. Unable to perform the action.`)
    }
})

app.get("/users", (req,res) => {
    return res.json(users)
})
app.post("/newUser", (req, res) => {
    const newUserID = users[users.length - 1].id + 1;
    const body = req.body
    const newUser = {
        id: newUserID,
        first_name: body.first_name,
        last_name: body.last_name,
        email: body.email,
        gender: body.gender,
        job_title: body.job_title
    }
    users.push(newUser)
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err) => {
        if(err){
            return res.send("Error", err)
        } else{
            return res.json({Status: "Finished", id: newUserID})
        }
    })
})

app.listen(port, () => console.log(`Server running on port`, port))