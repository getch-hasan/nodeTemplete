import { message } from './../../node_modules/aws-sdk/clients/customerprofiles.d';
import { Request, Response } from "express";
import Product from "../models/product.model"; // ✅ Ensure correct import
import cloudinary from '../config/env';

// create Product
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, price, description, category } = req.body;

    if (!name || !price || !description || !category) {
       res.status(400).json({ error: "All fields are required" });
       return
    }

     // Get uploaded images from Multer
     const thumb = req.files && (req.files as any).thumb ? (req.files as any).thumb[0].path : null;
     const gallary = req.files && (req.files as any).gallary ? (req.files as any).gallary.map((file: any) => file.path) : [];
 

    // ✅ Save Product to MongoDB
    const newProduct = new Product({ name, price, description, category, thumb, gallary });
    await newProduct.save();

    res.status(201).json({
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: "Error creating product", details: error });
  }
};

// get all product
export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find();
    res.status(200).json({
      message: "Products fetched successfully",
      products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Products fetch failed",  details: (error as Error).message  });
  }
};

// delete Product
export const deleteProducts = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      res.status(404).json({ error: "Product Not found" });
    }
    await Product.findByIdAndDelete(id);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "error Delte Product", detail: error });
  }
};

// updata product

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, price, description, category } = req.body;

    if (!id) {
       res.status(400).json({ error: "Product ID is required" });
       return
    }

    // Find the existing product
    const product = await Product.findById(id);
    if (!product) {
       res.status(404).json({ error: "Product not found" });
       return
    }

    // Handle new image uploads
    let updatedThumb = product.thumb;
    let updatedGallery = Array.isArray(product.gallary) ? product.gallary : [];

    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      
      console.log("Received files:", files);

      // Handle thumbnail update
      if (files.thumb && files.thumb.length > 0) {
        if (product.thumb) {
          const publicId = product.thumb.split("/").pop()?.split(".")[0];
          if (publicId) {
            await cloudinary.uploader.destroy(`products/${publicId}`);
          }
        }
        updatedThumb = files.thumb[0].path;
      }

      // Handle gallery update
      if (files.gallary && files.gallary.length > 0) {
        for (let img of updatedGallery) {
          const publicId = img.split("/").pop()?.split(".")[0];
          if (publicId) {
            await cloudinary.uploader.destroy(`products/${publicId}`);
          }
        }
        updatedGallery = files.gallary.map((file) => file.path);
      }
    }

    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, price, description, category, thumb: updatedThumb, gallary: updatedGallery },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
       res.status(500).json({ error: "Failed to update product" });
       return
    }

    res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Error updating product", details: (error as Error).message });
  }
};



// get single product
export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // Get product ID from URL

    // Find product by ID in MongoDB
    const product = await Product.findById(id);

    if (!product) {
       res.status(404).json({ error: "Product not found" });
       return
    }

    res.status(200).json({ message:"Product fetch successfully", product });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};