const express = require('express')
const users = require('./MOCK_DATA.json')
const port = 8000
const app = express()

app.route("/users/:id").get((req, res) => {
    const id = Number(req.params.id)
    const user = users.find(element => element.id === id)
    return res.json(user)
}).put((req,res) => {
    return res.send('Status: Pending')
}).patch((req,res) => {
    return res.send('Status: Pending')
}).delete((req,res) => {
    return res.send('Status: Pending')
})

app.get("/users", (req,res) => {
    return res.json(users)
})

app.listen(port, () => console.log(`Server running on port`, port))