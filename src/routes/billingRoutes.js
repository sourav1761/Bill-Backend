import express from "express";
import {
  createBill,
  getBillById,
  getAllBills,
  getSalesSummary,
  generateBillPDF
} from "../controllers/billingController.js";

const router = express.Router();

// Create bill
router.post("/", createBill);

// Get all bills
router.get("/", getAllBills);

// Get bill by ID
router.get("/:id", getBillById);

// Get sales summary
router.get("/summary/sales", getSalesSummary);

// Generate PDF
router.get("/:id/pdf", generateBillPDF);

export default router;