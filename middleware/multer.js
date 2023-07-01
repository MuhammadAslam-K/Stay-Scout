import multer from "multer"
import path from "path"

// const storage = multer.diskStorage({});

// const upload = multer({
//     storage: storage,
//     limits: {
//         fileSize: 1024 * 1024 * 5
//     }
// });

// export default upload;

const upload = multer({
    storage: multer.diskStorage({}),
    fileFilter: (req, file, cb) => {
        let ext = path.extname(file.originalname)
        if (ext != ".jpg" && ext != ".jpeg" && ext != ".png") {
            cb(new Error("file type is not supported"), false)
            return
        }
        cb(null, true)
    }
})

export default upload