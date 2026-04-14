import mongoose from 'mongoose';

const NoteSchema = new mongoose.Schema({
  note: { type: String, required: true },
  date: { type: String },
}, { timestamps: true });

export default mongoose.model('Note', NoteSchema);
