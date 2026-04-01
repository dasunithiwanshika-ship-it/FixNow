const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    serviceRequest: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceRequest', required: true },
    reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Typically the customer
    reviewee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Typically the worker
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
