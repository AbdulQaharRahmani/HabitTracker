import multer from 'multer';
import path from 'path';
import { AppError } from '../utils/error';

// Define the storage path and create new name for image
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/profile/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${req.user._id}-${Date.now()}`;
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// originalname -> profile.png
// extname -> .png
// mimetype -> type of file (image/jpg)

// validate allowed image types
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLocaleLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) cb(null, true);
  else cb(new AppError('Only images are allowed (jpeg, jpg, png, webp)', 400));
};

// export this middleware and then use it in needed routes
export const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, //max file size -> 2MB
  fileFilter,
});

export default upload;
