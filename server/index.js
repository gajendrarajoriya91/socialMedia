import express from "express";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import cors from "cors";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { register } from "./controllers/auth.js";
import { createPost } from "./controllers/posts.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import { fileURLToPath } from "url";
import { verifyToken } from "./middleware/auth.js";
const PORT = process.env.PORT || 6001;
import User from "./models/User.js";
import Post from "./models/Post.js";
import { users, posts } from "./data/index.js";

// Midlleware configuration
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();

app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

// File storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

//Routes with files
app.post("/auth/rigister", upload.single("picture"), register);
app.post("/posts", verifyToken, upload.single("picture"), createPost);

//Authenication Routes
app.use("/auth", authRoutes);

//Users Routes
app.use("/users", userRoutes);

//post Routes
app.use("/posts", postRoutes);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MOngoDB connected!"))
  .catch((err) => console.log(err));

//Data Inserted
// User.insertMany(users);
// Post.insertMany(posts);

//PORT
app.listen(PORT, (err) => {
  if (err) {
    console.log(`Error 58 : ${err}`);
  }
  console.log(`Server is running on : http://localhost:${PORT}`);
});
