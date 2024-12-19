const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/Information");

const messageSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    submissionDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Information', messageSchema);
