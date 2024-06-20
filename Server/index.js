const http = require("http")
const fs = require("fs")
const url = require("url")
const IST = require("./IST")

const myServer = http.createServer((req, res) => {
    if(req.url == '/favicon.ico'){
        return res.end()
    }
    console.log(req.url);
    const myUrl = url.parse(req.url, true) 
    /*
    req.url = http://localhost:8000/about?name=dinesh&id=77&tag=syrax
    This is the imp statement. 
    If you don't provide true to the url.parse(req.url), 
    myUrl can't be a querystring and we get the response values as undefined.
                    Name: undefined,
                    id: undefined,
                    tag: undefined 
    */
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
            default:
                res.end("404 - NOT FOUND");
        }
    })
});

myServer.listen(8000, () => {console.log(`Server running on PORT 8000`)})
