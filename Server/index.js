const express = require("express")
const port = 8000
const app = express()
app.get("/", (req, res) => {
    return res.send("Hello from the Home Page")
})
app.get("/about", (req,res) => {
    return res.send("Hello " + req.query.name + " from About Page")
})
app.listen(port, () => console.log("Server started on ", port))