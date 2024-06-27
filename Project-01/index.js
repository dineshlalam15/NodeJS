const express = require('express')
const fs = require('fs')
const users = require('./MOCK_DATA.json')
const port = 8000
const app = express()

app.use(express.urlencoded({extended: false}))
app.use((req,res, next) => {
    console.log(`Hello from the middleware 1`)
    next();
})

app.route("/users/:id")
.get((req, res) => {
    const id = Number(req.params.id)
    const user = users.find(element => element.id === id)
    if(user != null){
        return res.status(200).json(user)
    } else{
        return res.status(404).send(`Error 404: User with id ${id} doesn't exist`)
    }
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
                res.status(200).send(`Error: ${err}`)
            } else{
                return res.json({Status: "Succesfully Changed", id: id})
            }
        })
    } else{
        res.status(404).send(`User with id ${id} doesn't exist. Action can't be performed`)
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
                res.status(200).json({Status: "User Data Succesfully Deleted", id: id})
            }
        })
    } else{
        return res.status(404).send(`User with id number ${id} doesn't exist. Unable to perform the action.`)
    }
})

app.get("/users", (req,res) => {
    return res.json(users)
})
app.post("/newUser", (req, res) => {
    const newUserID = users[users.length - 1].id + 1;
    const body = req.body
    if(!body || !body.first_name || !body.last_name || !body.email || !body.gender || !body.job_title){
        return res.status(400).send(`Enter all the required fields of the user`)
    }
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
            return res.send("ERROR", err)
        } else{
            return res.status(201).json({Status: "New User Created Succesfully", id: newUserID})
        }
    })
})

app.listen(port, () => console.log(`Server running on port`, port))