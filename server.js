const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Subject = require('./models/Subject'); // Import the model
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Pointing to your local MongoDB
const MONGO_URI = 'mongodb://127.0.0.1:27017/portalDB';

mongoose.connect(MONGO_URI)
    .then(() => console.log('Successfully connected to Local MongoDB! ✅'))
    .catch((err) => console.error('Connection error:', err));

// 1. GET ENDPOINT (Retrieval from DB)
app.get('/api/subjects', async (req, res) => {
    try {
        const subjects = await Subject.find();
        res.status(200).json({ success: true, count: subjects.length, data: subjects });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// 2. POST ENDPOINT (Creation in DB)
app.post('/api/subjects', async (req, res) => {
    try {
        const { name, grade } = req.body;
        if (!name || !grade) return res.status(400).json({ success: false, error: "Provide name and grade" });

        const newSubject = await Subject.create({ name, grade });
        res.status(201).json({ success: true, data: newSubject });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});
// UPDATE: Change a grade by ID
app.put('/api/subjects/:id', async (req, res) => {
    try {
        const updatedSubject = await Subject.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ success: true, data: updatedSubject });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// DELETE: Remove a subject by ID
app.delete('/api/subjects/:id', async (req, res) => {
    try {
        await Subject.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Subject deleted" });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});
app.listen(PORT, () => console.log(`Backend API Engine running on http://localhost:${PORT}`));