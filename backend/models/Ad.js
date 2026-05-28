const mongoose = require('mongoose');

const adSchema = new mongoose.Schema({
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
  startDate: { type: Date },
  endDate: { type: Date },
  targetRole: { type: String, enum: ['Customer', 'Worker', 'All'], default: 'All' },
  link: { type: String },
  isActive: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // admin who created
}, { timestamps: true });

module.exports = mongoose.model('Ad', adSchema);
