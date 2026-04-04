// import Product from "../models/Product.js";
// import crypto from "crypto";

// import QRCode from "qrcode";

// // Create new product
// export const createProduct = async (req, res) => {
//   try {
    
//     const { name, size, mrp } = req.body;

//     // Validate required fields
//     if (!name || !size || !mrp) {
//       return res.status(400).json({
//         success: false,
//         message: "Name, size, and MRP are required"
//       });
//     }

//     // Validate MRP
//    const mrpNumber = Number(mrp);
//     if (isNaN(mrpNumber) || mrpNumber <= 0) {
//       return res.status(400).json({
//         success: false,
//         message: "MRP must be a positive number"
//       });
//     }
//     // Calculate RCP (30% off MRP)
// const rcp = Number((mrpNumber * 0.7).toFixed(2));

// // Generate unique QR code value
// const qrCode = crypto.randomUUID(); // Node 16+

// const product = await Product.create({
//       name: name.trim(),
//       size: size.trim(),
//       mrp: mrpNumber,
//       rcp,
//       qrCode: crypto.randomUUID() // ✅ FIX
//     });

//     res.status(201).json({
//       success: true,
//       product,
//       message: "Product created successfully"
//     });

//   } catch (error) {
//     console.error("CREATE PRODUCT ERROR:", error);

//     if (error.name === "ValidationError") {
//       return res.status(400).json({
//         success: false,
//         message: "Validation failed",
//         errors: Object.values(error.errors).map(e => e.message)
//       });
//     }

//     res.status(500).json({
//       success: false,
//       message: "Server error",
//       error: error.message
//     });
//   }
// };    
    

// // Get all products
// export const getProducts = async (req, res) => {
//   try {
//     const products = await Product.find().sort({ createdAt: -1 });
//     res.json({
//       success: true,
//       products: products
//     });
//   } catch (error) {
//     console.error("GET PRODUCTS ERROR:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//       error: error.message
//     });
//   }
// };

// // Get product by ID (for QR scanning)
// export const getProductById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     console.log("Searching product by ID:", id);
    
//     const product = await Product.findById(id);
    
//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: "Product not found"
//       });
//     }
    
//     res.json({
//       success: true,
//       product: product
//     });
    
//   } catch (error) {
//     console.error("GET BY ID ERROR:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//       error: error.message
//     });
//   }
// };

// // Search products
// export const searchProducts = async (req, res) => {
//   try {
//     const { query } = req.query;
    
//     let filter = {};
//     if (query && query.trim() !== "") {
//       filter = {
//         $or: [
//           { name: { $regex: query, $options: 'i' } },
//           { size: { $regex: query, $options: 'i' } }
//         ]
//       };
//     }
    
//     const products = await Product.find(filter).sort({ createdAt: -1 });
    
//     res.json({
//       success: true,
//       products: products
//     });
    
//   } catch (error) {
//     console.error("SEARCH ERROR:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//       error: error.message
//     });
//   }
// };

// // Update product
// export const updateProduct = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updateData = req.body;
    
//     // If MRP is updated, recalculate RCP
//     if (updateData.mrp) {
//       const mrpNumber = parseFloat(updateData.mrp);
//       updateData.rcp = parseFloat((mrpNumber * 0.7).toFixed(2));
//     }
    
//     const product = await Product.findByIdAndUpdate(
//       id,
//       updateData,
//       { new: true, runValidators: true }
//     );
    
//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: "Product not found"
//       });
//     }
    
//     res.json({
//       success: true,
//       product: product,
//       message: "Product updated successfully"
//     });
    
//   } catch (error) {
//     console.error("UPDATE ERROR:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//       error: error.message
//     });
//   }
// };

// // Delete product
// export const deleteProduct = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const product = await Product.findByIdAndDelete(id);
    
//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: "Product not found"
//     });
//     }
    
//     res.json({
//       success: true,
//       message: "Product deleted successfully"
//     });
    
//   } catch (error) {
//     console.error("DELETE ERROR:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//       error: error.message
//     });
//   }
// };



import Product from "../models/Product.js";
import crypto from "crypto";
import mongoose from "mongoose";

// ===============================
// CREATE PRODUCT
// ===============================
export const createProduct = async (req, res) => {
  try {
    const { name, size, mrp, rcp } = req.body;

    if (!name || !size || !mrp || !rcp) {
      return res.status(400).json({
        success: false,
        message: "Name, size, MRP and RCP are required"
      });
    }

    const mrpNumber = Number(mrp);
    const rcpNumber = Number(rcp);

    if (isNaN(mrpNumber) || mrpNumber <= 0) {
      return res.status(400).json({ success: false, message: "MRP must be a positive number" });
    }
    if (isNaN(rcpNumber) || rcpNumber <= 0 || rcpNumber > mrpNumber) {
      return res.status(400).json({ success: false, message: "RCP must be a positive number less than or equal to MRP" });
    }

    const qrCode = crypto.randomUUID();

    const product = await Product.create({
      name: name.trim(),
      size: size.trim(),
      mrp: mrpNumber,
      rcp: rcpNumber,
      qrCode
    });

    res.status(201).json({
      success: true,
      product,
      message: "Product created successfully"
    });

  } catch (error) {
    console.error("CREATE PRODUCT ERROR:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Duplicate QR code detected"
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// ===============================
// GET ALL PRODUCTS
// ===============================
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      products
    });

  } catch (error) {
    console.error("GET PRODUCTS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// ===============================
// GET PRODUCT BY ID OR QR CODE
// (USED BY QR SCAN + MANUAL ID)
// ===============================
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("🔍 Searching product:", id);

    let product = null;

    // ✅ If Mongo ObjectId → search by _id
    if (mongoose.Types.ObjectId.isValid(id)) {
      product = await Product.findById(id);
    }

    // ✅ If not found → search by qrCode
    if (!product) {
      product = await Product.findOne({ qrCode: id });
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.json({
      success: true,
      product
    });

  } catch (error) {
    console.error("GET PRODUCT ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// ===============================
// SEARCH PRODUCTS
// ===============================
export const searchProducts = async (req, res) => {
  try {
    const { query } = req.query;

    let filter = {};
    if (query && query.trim() !== "") {
      filter = {
        $or: [
          { name: { $regex: query, $options: "i" } },
          { size: { $regex: query, $options: "i" } }
        ]
      };
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      products
    });

  } catch (error) {
    console.error("SEARCH ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// ===============================
// UPDATE PRODUCT (BY _id ONLY)
// ===============================
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (updateData.mrp) updateData.mrp = Number(updateData.mrp);
    if (updateData.rcp) updateData.rcp = Number(updateData.rcp);

    const product = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.json({
      success: true,
      product,
      message: "Product updated successfully"
    });

  } catch (error) {
    console.error("UPDATE ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// ===============================
// DELETE PRODUCT (BY _id ONLY)
// ===============================
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.json({
      success: true,
      message: "Product deleted successfully"
    });

  } catch (error) {
    console.error("DELETE ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};
