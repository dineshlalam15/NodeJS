const { error } = require("console")
const fs = require("fs")
const os = require("os")

fs.writeFileSync("./check.txt", "Sengupta Hall")
fs.writeFile("./check.txt", "Hello World Async", (err) => {})

const result = fs.readFileSync("./contacts.txt", "utf-8") // utf-8 is for encoding. 
console.log(result)

fs.appendFileSync("./contacts.txt", "\nNew User: +91XXXXXXXXXX")
console.log("After Updating file: ")
const result1 = fs.readFileSync("./contacts.txt", "utf-8") // utf-8 is for encoding. 
console.log(result1)

// Asynchronous 
fs.readFile("./contacts.txt", "utf-8", (err, ans) => {
    if(err){
        console.log("Error: ", err)
    } else{
        console.log(ans)
    }
})

// Asynchronous
fs.appendFile("./check.txt", "\nDurga Prasad", (err, msg) => {
    if(err){
        console.log("ERROR MESSAGE: ", err)
    } else{
        msg = fs.readFileSync("./check.txt", "utf-8")
        console.log(msg);
    }
})

fs.copyFileSync("./contacts.txt", "./copy.txt")
fs.unlinkSync("./copy.txt")
console.log(fs.statSync("./contacts.txt"))

console.log(os.cpus().length)