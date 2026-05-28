const mongoose = require('mongoose');

const serviceRequestSchema = new mongoose.Schema({
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    worker: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    serviceType: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    budget: { type: Number, required: true },
    images: [{ type: String }], // Optional job images from Customer
    progressImages: [{ type: String }], // Work progress images from Worker
    paymentMethod: { type: String, enum: ['Cash', 'Card'], default: 'Cash' },
    status: { 
        type: String, 
        enum: ['Posted', 'Accepted', 'In Progress', 'Completed', 'Paid', 'Reviewed'], 
        default: 'Posted' 
    }
}, { timestamps: true });

module.exports = mongoose.model('ServiceRequest', serviceRequestSchema);
