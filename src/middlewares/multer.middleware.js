const multer = require("multer");


const storage = multer.diskStorage({
    destination: function (req,file,cb) {
        cb(null,"./public/temp")
    },
    filename: function (req,file,cb) {
        const uniqueSuffix = Date.now();
        cb(null,file.fieldname + '-' + uniqueSuffix);
        //saving file name with current date + original user file name
    }
})

//cb ={callback}

const upload = multer({storage:storage});

module.exports = upload;