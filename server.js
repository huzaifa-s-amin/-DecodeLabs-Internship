const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;
app.use(cors());
// Middleware to automatically parse incoming JSON requests
app.use(express.json());

// Our temporary "database" (since we aren't using a real database yet)
let subjects = [
    { id: 1, name: "Physics", grade: "A" },
    { id: 2, name: "Mathematics", grade: "A+" }
];

// ==========================================
// 1. GET ENDPOINT (Retrieval)
// Follows RESTful rule: Noun-based route (/api/subjects)
// ==========================================
app.get('/api/subjects', (req, res) => {
    // Simply returns the current list of subjects as JSON
    res.status(200).json({
        success: true,
        count: subjects.length,
        data: subjects
    });
});

// ==========================================
// 2. POST ENDPOINT (Creation & Validation)
// Follows RESTful rule: Same noun route, different method
// ==========================================
app.post('/api/subjects', (req, res) => {
    const { name, grade } = req.body;

    // Requirement: Validate basic data
    if (!name || !grade) {
        return res.status(400).json({
            success: false,
            error: "Please provide both a subject name and a grade."
        });
    }

    // Process the input and create a new record
    const newSubject = {
        id: subjects.length + 1,
        name: name,
        grade: grade
    };

    subjects.push(newSubject);

    // Output the response
    res.status(201).json({
        success: true,
        data: newSubject
    });
});

// Start the server engine
app.listen(PORT, () => {
    console.log(`Backend API Engine running on http://localhost:${PORT}`);
});