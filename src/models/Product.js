import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: String,
  size: String,
  mrp: Number,
  rcp: Number,
  qrCode: {
    type: String,
    unique: true,
    required: true   // ⭐ important
  }
});

export default mongoose.model("Product", productSchema);