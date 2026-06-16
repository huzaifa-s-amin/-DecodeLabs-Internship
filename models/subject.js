const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    grade: { type: String, required: true }
});

module.exports = mongoose.model('Subject', subjectSchema);