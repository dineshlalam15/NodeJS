const {format} = require('date-fns')
const {toZonedTime} = require('date-fns-tz')

module.exports = IST
function IST(UTCtime){
    const timeZone = 'Asia/Kolkata'
    const zonedDate = toZonedTime(UTCtime, timeZone)
    const formattedDate = format(zonedDate, "yyyy-MM-dd'T'HH:mm:ssXXX", {timeZone})
    return formattedDate
}

const now = new Date()
console.log(IST(now))
