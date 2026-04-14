import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
  desc: { type: String, required: true },
  date: { type: String },
  reminder: { type: String },
  status: { type: String, default: 'Pending' },
}, { timestamps: true });

export default mongoose.model('Task', TaskSchema);
