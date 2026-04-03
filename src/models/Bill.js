import mongoose from 'mongoose';

// Schema for each bill item
const billItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: false // manual/custom items won't have productId
  },
  name: { type: String, required: true },
  size: String,
  mrp: { type: Number, required: true, min: 0 },
  rcp: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 1 },
  total: { type: Number, required: true, min: 0 },
  isCustom: { type: Boolean, default: false } // flag for manual/custom items
});

// Main Bill schema
const billSchema = new mongoose.Schema({
  billNumber: {
    type: String,
    required: true,
    unique: true
  },
  items: [billItemSchema],
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  discount: {
    type: Number,
    default: 0,
    min: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  whatsappNumber: String,
  customerName: String,
  date: {
    type: Date,
    default: Date.now
  },
  printed: {
    type: Boolean,
    default: false
  },
  whatsappSent: {
    type: Boolean,
    default: false
  }
});

const Bill = mongoose.model('Bill', billSchema);

export default Bill;