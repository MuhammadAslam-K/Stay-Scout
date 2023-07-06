import multer from "multer";
import path from "path";
import { fileURLToPath } from 'url'


const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// const upload = multer({
//     storage: multer.diskStorage({
//         destination: "uploads/", // Specify the desired destination folder
//         filename: (req, file, cb) => {
//             const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//             const extension = path.extname(file.originalname);
//             cb(null, file.fieldname + "-" + uniqueSuffix + extension);
//         },
//     }),
//     fileFilter: (req, file, cb) => {
//         const allowedExtensions = [".jpg", ".jpeg", ".png"];
//         const ext = path.extname(file.originalname);

//         if (!allowedExtensions.includes(ext)) {
//             cb(new Error("File type is not supported"), false);
//             return;
//         }
//         cb(null, true);
//     },
// });

// export default upload;

// const multer = require('multer')
// const path = require('path')

const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',
    'image/avif': 'avif'
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('invalid image type');

        if (isValid) {
            uploadError = null
        }
        // cb(uploadError, path.join(__dirname, '../public/uploads'))
        cb(uploadError, "")
    },
    filename: function (req, file, cb) {
        const fileName = Date.now() + '_' + file.originalname;
        cb(null, fileName)
    }
})

const upload = multer({ storage: storage });

export default upload
