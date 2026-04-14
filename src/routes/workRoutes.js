import express from 'express';
import Note from '../models/Note.js';
import Task from '../models/Task.js';
import Expense from '../models/Expense.js';

const router = express.Router();

// NOTES
router.get('/notes', async (req, res) => {
  const notes = await Note.find().sort({ createdAt: -1 });
  res.json(notes);
});
router.post('/notes', async (req, res) => {
  const note = await Note.create(req.body);
  res.json(note);
});
router.delete('/notes/:id', async (req, res) => {
  await Note.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// TASKS
router.get('/tasks', async (req, res) => {
  const tasks = await Task.find().sort({ createdAt: -1 });
  res.json(tasks);
});
router.post('/tasks', async (req, res) => {
  const task = await Task.create(req.body);
  res.json(task);
});
router.patch('/tasks/:id', async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(task);
});
router.delete('/tasks/:id', async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// EXPENSES
router.get('/expenses', async (req, res) => {
  const expenses = await Expense.find().sort({ createdAt: -1 });
  res.json(expenses);
});
router.post('/expenses', async (req, res) => {
  const expense = await Expense.create(req.body);
  res.json(expense);
});
router.delete('/expenses/:id', async (req, res) => {
  await Expense.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

export default router;
