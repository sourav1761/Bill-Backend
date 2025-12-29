import mongoose from 'mongoose';

const billItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: String,
  size: String,
  mrp: Number,
  rcp: Number,
  quantity: Number,
  total: Number
  // REMOVED: code field
});

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

// Generate bill number
billSchema.pre('save', function(next) {
  if (!this.billNumber) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(1000 + Math.random() * 9000);
    this.billNumber = `INV${year}${month}${day}${random}`;
  }
  next();
});

const Bill = mongoose.model('Bill', billSchema);
export default Bill;