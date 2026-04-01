const mongoose = require('mongoose');

const serviceRequestSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    worker: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Assigned when a worker is hired
    title: { type: String, required: true },
    description: { type: String, required: true },
    serviceType: { type: String, required: true }, // e.g., 'Plumbing', 'Electrical'
    location: { type: String, required: true },
    budget: { type: Number }, // Auto-suggested or manually entered price
    status: {
      type: String,
      enum: ['Posted', 'Accepted', 'In Progress', 'Completed', 'Paid', 'Reviewed'],
      default: 'Posted',
    },
    images: [{ type: String }], // Issue or workspace images uploaded by customer
    date: { type: Date, required: true }, // Expected date/time for the service
  },
  { timestamps: true }
);

const ServiceRequest = mongoose.model('ServiceRequest', serviceRequestSchema);
module.exports = ServiceRequest;
