import multer from 'multer'

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/temp')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

export const upload = multer({storage: storage})

/*
Reference: https://www.npmjs.com/package/multer
Two functions are present above: (i) destination, (ii) filename
destination is used to determine within which folder the uploaded files should be stored.
filename is used to determine what the file should be named inside the folder.
*/