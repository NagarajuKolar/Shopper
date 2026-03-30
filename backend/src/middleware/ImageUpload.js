
import multer from "multer";
import path from "path";


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "src/uploads/reviews");

    },

    filename: (req, file, cb) => {
        const uniqueName =
            Date.now() + "-"  + path.extname(file.originalname);

        cb(null, uniqueName);
    },
});

// file filter
const fileFilter = (req, file, cb) => {
    if (
        file.mimetype.startsWith("image/")//mimetype must be image for images
    ) {
        cb(null, true);
    } else {
        cb(new Error("Only image files allowed"), false);
    }
};

const Imageupload = multer({
    storage,
    limits: {
        fileSize: 2 * 1024 * 1024, // 2MB per image
    },
    fileFilter,
});

export default Imageupload;
