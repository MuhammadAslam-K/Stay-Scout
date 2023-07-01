// import multer from "multer"
// import path from "path"


// const upload = multer({
//     storage: multer.diskStorage({}),
//     fileFilter: (req, file, cb) => {

//         let ext = path.extname(file.originalname)

//         if (ext != ".jpg" && ext != ".jpeg" && ext != ".png") {
//             cb(new Error("file type is not supported"), false)
//             return
//         }
//         cb(null, true)
//     }
// })

// export default upload

import multer from "multer";
import path from "path";

const upload = multer({
    storage: multer.diskStorage({
        destination: "uploads/", // Specify the desired destination folder
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
            const extension = path.extname(file.originalname);
            cb(null, file.fieldname + "-" + uniqueSuffix + extension);
        },
    }),
    fileFilter: (req, file, cb) => {
        const allowedExtensions = [".jpg", ".jpeg", ".png"];
        const ext = path.extname(file.originalname);

        if (!allowedExtensions.includes(ext)) {
            cb(new Error("File type is not supported"), false);
            return;
        }
        cb(null, true);
    },
});

export default upload;
