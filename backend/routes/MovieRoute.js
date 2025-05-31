import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { 
     getMovies, 
     getMoviebyId,
     createMovie,
     updateMovie,
     deleteMovie 
} from "../controllers/MovieController.js";

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'posters');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, 'poster-' + uniqueSuffix + extension);
  }
});

// File filter to accept only images
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed.'), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Routes
router.get("/Movies", getMovies);
router.get("/Movies/:id", getMoviebyId);
router.post("/Movies", upload.single('poster'), createMovie);
router.patch("/Movies/:id", upload.single('poster'), updateMovie);
router.delete("/Movies/:id", deleteMovie);

export default router;