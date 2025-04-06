import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/user.routes";
import productRoutes from "./routes/product.routes";
import multer from "multer";
import protectedRoutes from "./routes/protectet.route";


dotenv.config();


const app = express();
app.use(express.json());
app.use(cors());

// Use User Routes
app.use("/api/users", userRoutes);
app.use("/api/protected", protectedRoutes);
app.use("/api/products", productRoutes);
export default app;
