import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts
} from "../controllers/productController.js";

const router = express.Router();

// GET all products
router.get("/", getProducts);

// GET search products
router.get("/search", searchProducts);

// GET product by ID
router.get("/:id", getProductById);

// POST create product
router.post("/", createProduct);

// PUT update product
router.put("/:id", updateProduct);

// DELETE product
router.delete("/:id", deleteProduct);

export default router;