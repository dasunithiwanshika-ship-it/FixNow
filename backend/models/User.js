const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['Customer', 'Worker'], default: 'Customer' },
    profileImage: { type: String, default: '' },
    // Fields specific to Workers
    serviceType: { type: String }, // e.g., 'Plumber', 'Electrician'
    location: { type: String },
    rating: { type: Number, default: 0 },
    reviewsCount: { type: Number, default: 0 },
    portfolio: [{ type: String }] // Array of image URLs for completed jobs
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);