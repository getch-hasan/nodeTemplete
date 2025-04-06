import express from "express";
import { getUsers, logIn, register } from "../controllers/user.controller"; // <-- Fixed Import
import multer from "multer";
const upload = multer();
const router = express.Router();

router.get("/", getUsers);
router.post("/register", upload.none(), register);
router.post("/login", upload.none(), logIn);

export default router;
