const multer = require("multer");
const path = require("path")


const storage = multer.diskStorage({
    destination: function (req,file,cb) {
        cb(null,"./public/temp")
    },
    filename: function (req,file,cb) {
        const unique = Date.now() + path.extname(file.originalname);
        cb(null,`avatar-${unique}`);
        //saving file name with current date + original user file name
    }
})

//cb ={callback}

const upload = multer({storage:storage});

module.exports = upload;