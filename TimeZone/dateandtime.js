const now = new Date()
console.log(now)

const year = now.getFullYear()
const month = now.getMonth() + 1 // Months are 0 indexed. 
const date = now.getDate()
const hours = now.getHours()
const minutes = now.getMinutes()
const seconds = now.getSeconds()
console.log(`
    Year: ${year},
    Month: ${month},
    Date: ${date},
    Hours: ${hours},
    Minutes: ${minutes},
    Seconds: ${seconds}
    `)

const formattedDate = now.toLocaleString('en-us', {timeZone: 'UTC'})
console.log(formattedDate)

const isoString = now.toISOString()
console.log(isoString)