import  multer  from 'multer';
import express from "express";
import { createProduct, deleteProducts, getProductById, getProducts, searchProduct, updateProduct,  } from "../controllers/product.controller";
import { uploadProductImage } from '../middlewares/upload';

const router = express.Router();
const upload = multer();
router.post("/",uploadProductImage, createProduct);
router.get("/", getProducts);
router.delete("/:id", deleteProducts); 
router.put("/:id",upload.none(), updateProduct); 
router.get("/:id", getProductById);
router.post("/search",upload.none(), searchProduct);

export default router;
 