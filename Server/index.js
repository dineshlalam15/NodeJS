const http = require("http")
const fs = require("fs")
const url = require("url")
const IST = require("./IST")
function myHandler(req, res){
    if(req.url == '/favicon.ico'){
        return res.end()
    }
    console.log(req.url);
    const myUrl = url.parse(req.url, true) 
    console.log(myUrl)
    const now = new Date()
    const enter = `${req.url}, ${req.method}, ${IST(now)}\n`
    fs.appendFile("log.txt", enter, (err) =>{
        if(err){
            console.log("ERROR: ", err)
            return res.end("INTERNAL ERROR CAUSED")
        }
        switch(myUrl.pathname){
            case "/":
                res.end("Hello, there");
                break;
            case "/about":
                const name = myUrl.query.name;
                const id = myUrl.query.id;
                const tag = myUrl.query.tag;
                res.end(`
                    Name: ${name},
                    id: ${id},
                    tag: ${tag}
                `);
                break;
                case "/signup":
                    if(req.method == "GET"){
                        res.end("This is a sign-up form")
                    } else if(req.method == "Post"){
                        res.end("Success");
                    }
            default:
                res.end("404 - NOT FOUND");
        }
    })
}
const myServer = http.createServer(myHandler);
myServer.listen(8000, () => {console.log(`Server running on PORT 8000`)})
