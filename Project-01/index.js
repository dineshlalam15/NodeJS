const express = require('express')
const users = require('./MOCK_DATA.json')
const port = 8000
const app = express()

app.get("/users", (req,res) => {
    return res.json(users)
})

app.get("/users/:id", (req,res) => {
    const id = Number(req.params.id)
    const user = users.find(element => element.id === id)
    return res.json(user)
})
app.listen(port, () => console.log(`Server running on port`, port))