const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceRequest', required: true },
    reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Usually Customer
    worker: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
