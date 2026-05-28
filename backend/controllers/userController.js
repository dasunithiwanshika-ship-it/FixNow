const User = require('../models/User');
const ServiceRequest = require('../models/ServiceRequest');
const Review = require('../models/Review');

// @route   PUT /api/users/profile
// @desc    Update user or worker profile
// @access  Private
exports.updateProfile = async (req, res) => {
    try {
        const { name, profileImage, location, serviceType } = req.body;
        
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (name) user.name = name;
        if (profileImage) user.profileImage = profileImage;
        if (location) user.location = location;
        if (serviceType && user.role === 'Worker') user.serviceType = serviceType;

        await user.save();
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   GET /api/users/dashboard
// @desc    Get dashboard analytics/stats for User or Worker
// @access  Private
exports.getDashboardStats = async (req, res) => {
    try {
        const userId = req.user.id;
        const role = req.user.role;

        let stats = {};

        if (role === 'Customer') {
            const postsCreated = await ServiceRequest.countDocuments({ customer: userId });
            
            const completedJobs = await ServiceRequest.find({ 
                customer: userId, 
                status: { $in: ['Completed', 'Paid', 'Reviewed'] } 
            });
            const totalPayments = completedJobs.reduce((sum, job) => sum + job.budget, 0);
            
            const reviewsGiven = await Review.countDocuments({ reviewer: userId });

            const activeJobs = await ServiceRequest.find({
                customer: userId,
                status: { $in: ['Accepted', 'In Progress'] }
            }).populate('worker', 'name profileImage rating');

            stats = {
                jobsCompleted: completedJobs.length,
                postsCreated,
                reviewsGiven,
                totalPayments,
                activeJobs
            };
        } else if (role === 'Worker') {
            const completedJobs = await ServiceRequest.find({ 
                worker: userId, 
                status: { $in: ['Completed', 'Paid', 'Reviewed'] } 
            });
            const totalEarnings = completedJobs.reduce((sum, job) => sum + job.budget, 0);
            
            const reviewsReceived = await Review.countDocuments({ worker: userId });

            const activeJobs = await ServiceRequest.find({
                worker: userId,
                status: { $in: ['Accepted', 'In Progress'] }
            }).populate('customer', 'name profileImage rating');

            stats = {
                jobsCompleted: completedJobs.length,
                reviewsReceived,
                totalEarnings,
                activeJobs
            };
        }

        res.json(stats);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
