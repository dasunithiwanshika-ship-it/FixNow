const Review = require('../models/Review');
const ServiceRequest = require('../models/ServiceRequest');
const User = require('../models/User');

// @route   POST /api/reviews
// @desc    Create a new review (Customer only, for completed jobs)
// @access  Private
exports.createReview = async (req, res) => {
    try {
        if (req.user.role !== 'Customer') {
            return res.status(403).json({ message: 'Only customers can leave reviews' });
        }

        const { jobId, rating, comment } = req.body;

        // Verify the job exists, belongs to the customer, and is 'Completed' or 'Paid'
        const job = await ServiceRequest.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: 'Service request not found' });
        }
        
        if (job.customer.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to review this job' });
        }

        if (job.status !== 'Completed' && job.status !== 'Paid') {
            return res.status(400).json({ message: 'Can only review completed or paid jobs' });
        }

        // Check if review already exists
        const existingReview = await Review.findOne({ job: jobId });
        if (existingReview) {
            return res.status(400).json({ message: 'Review already submitted for this job' });
        }

        // Create review
        const review = new Review({
            job: jobId,
            reviewer: req.user.id,
            worker: job.worker,
            rating,
            comment
        });

        await review.save();

        // Update Job Status
        job.status = 'Reviewed';
        await job.save();

        // Update Worker's average rating
        const workerReviews = await Review.find({ worker: job.worker });
        const totalRating = workerReviews.reduce((sum, r) => sum + r.rating, 0);
        const avgRating = totalRating / workerReviews.length;

        await User.findByIdAndUpdate(job.worker, {
            rating: avgRating.toFixed(1),
            reviewsCount: workerReviews.length
        });

        res.status(201).json(review);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   GET /api/reviews/worker/:workerId
// @desc    Get all reviews for a specific worker
// @access  Public (or Private depending on requirements, making Private for now)
exports.getWorkerReviews = async (req, res) => {
    try {
        const mongoose = require('mongoose');
        if (!mongoose.Types.ObjectId.isValid(req.params.workerId)) {
            return res.status(400).json({ message: 'Invalid worker ID' });
        }

        const reviews = await Review.find({ worker: req.params.workerId })
            .populate('reviewer', 'name profileImage')
            .populate('job', 'serviceType createdAt')
            .sort({ createdAt: -1 });

        res.json(reviews);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
