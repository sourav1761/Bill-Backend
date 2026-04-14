import mongoose from 'mongoose';

const ExpenseSchema = new mongoose.Schema({
  item: { type: String, required: true },
  date: { type: String },
  amount: { type: Number, required: true },
}, { timestamps: true });

export default mongoose.model('Expense', ExpenseSchema);
