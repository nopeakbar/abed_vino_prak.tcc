import express from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser";
import MovieRoute from './routes/MovieRoute.js';
import UserRoute from './routes/UserRoute.js';
import AdminRoute from './routes/AdminRoute.js';
import ReviewRoute from './routes/ReviewRoute.js';
import dotenv from "dotenv";
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();

// Get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Fix CORS - Frontend is on 3000, Backend on 3001
app.use(cors({ 
    credentials: true,
    origin: 'http://localhost:3000' // ✅ React app runs on 3000
}));

app.use(cookieParser());
app.use(express.json());
// ✅ Add this for form data handling (helpful for file uploads)
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");

// ✅ Serve static files from public folder (already perfect for file uploads)
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get("/", (req, res) => res.render("index"));
app.use(MovieRoute);
app.use(UserRoute);
app.use(AdminRoute);
app.use(ReviewRoute);

// ✅ Add error handling middleware for file upload errors
app.use((error, req, res, next) => {
  // Handle Multer errors (file upload errors)
  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ message: 'File too large. Maximum size is 5MB.' });
  }
  if (error.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({ message: 'Too many files or unexpected field name.' });
  }
  
  if (error.message && error.message.includes('Invalid file type')) {
    return res.status(400).json({ message: error.message });
  }
  
  console.error('Server Error:', error);
  res.status(500).json({ message: 'Internal server error' });
});

// ✅ Backend runs on 3001
app.listen(3001, () => {
  console.log('Server is running on port 3001');
  console.log('File uploads will be stored in: public/uploads/posters/');
});