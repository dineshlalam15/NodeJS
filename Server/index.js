const http = require("http")
const express = require("express")
const app = express()
app.get("/", (req, res) => {
    return res.send("Hello from the Home Page")
})
app.get("/about", (req,res) => {
    return res.send("Hello " + req.query.name + " from About Page")
})
const myServer = http.createServer(app);
myServer.listen(8000, () => {console.log(`Server running on PORT 8000`)})

// Express is just a frame work that internally uses HTTP.
