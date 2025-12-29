import express from "express";
import { printer } from "../utils/printer.js";

const router = express.Router();

// ===============================
// PRINT QR LABEL ROUTE
// ===============================
router.post("/label", async (req, res) => {
  const { id, name, size, mrp, rcp } = req.body;

  if (!id || !name || !size || !mrp) {
    return res.status(400).json({
      success: false,
      message: "Invalid label data",
    });
  }

  try {
    await printer.printQRLabel({
      name,
      size,
      mrp,
      rcp,
      qrData: id, // 🔥 QR DATA = PRODUCT ID (BEST)
    });

    return res.json({
      success: true,
      message: "Label printed successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Printer not connected or print failed",
    });
  }
});

export default router;

