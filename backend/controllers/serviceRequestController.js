const ServiceRequest = require('../models/ServiceRequest');

// @route   POST /api/services
// @desc    Create a new service request (Customer only)
// @access  Private
exports.createServiceRequest = async (req, res) => {
    try {
        if (req.user.role !== 'Customer') {
            return res.status(403).json({ message: 'Only customers can post service requests' });
        }

        const { serviceType, location, description, budget, images } = req.body;

        const newRequest = new ServiceRequest({
            customer: req.user.id,
            serviceType,
            location,
            description,
            budget,
            images: images || [],
        });

        const savedRequest = await newRequest.save();
        res.status(201).json(savedRequest);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   GET /api/services
// @desc    Get all active service requests (Workers viewing available jobs)
// @access  Private
exports.getAllServiceRequests = async (req, res) => {
    try {
        // Find jobs that are 'Posted' (not yet accepted)
        const requests = await ServiceRequest.find({ status: 'Posted' })
            .populate('customer', 'name profileImage rating')
            .sort({ createdAt: -1 });
            
        res.json(requests);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   GET /api/services/my-requests
// @desc    Get current user's service requests (Customers: their postings, Workers: their accepted jobs)
// @access  Private
exports.getUserServiceRequests = async (req, res) => {
    try {
        let requests;
        if (req.user.role === 'Customer') {
            requests = await ServiceRequest.find({ customer: req.user.id })
                .populate('worker', 'name profileImage rating serviceType location')
                .sort({ createdAt: -1 });
        } else {
            requests = await ServiceRequest.find({ worker: req.user.id })
                .populate('customer', 'name profileImage rating location')
                .sort({ createdAt: -1 });
        }
        res.json(requests);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   GET /api/services/:id
// @desc    Get single service request by ID
// @access  Private
exports.getServiceRequestById = async (req, res) => {
    try {
        const request = await ServiceRequest.findById(req.params.id)
            .populate('customer', 'name profileImage location rating reviewsCount')
            .populate('worker', 'name profileImage serviceType rating reviewsCount location');

        if (!request) {
            return res.status(404).json({ message: 'Service request not found' });
        }
        res.json(request);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Service request not found' });
        }
        res.status(500).send('Server Error');
    }
};

// @route   PUT /api/services/:id/status
// @desc    Update status (e.g., Worker accepts, Job completed)
// @access  Private
exports.updateServiceRequestStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['Posted', 'Accepted', 'In Progress', 'Completed', 'Paid', 'Reviewed'];
        
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status update' });
        }

        let request = await ServiceRequest.findById(req.params.id);

        if (!request) {
            return res.status(404).json({ message: 'Service request not found' });
        }

        // Automatically assign worker if they accept or start an unassigned job
        if (['Accepted', 'In Progress'].includes(status) && !request.worker) {
            if (req.user.role !== 'Worker') {
                return res.status(403).json({ message: 'Only workers can accept or start jobs' });
            }
            request.worker = req.user.id;
        } else if (status !== 'Posted' && req.user.role === 'Worker') {
            // Ensure no other worker can modify a job they didn't accept
            if (request.worker && request.worker.toString() !== req.user.id) {
                return res.status(403).json({ message: 'Job already accepted by another worker' });
            }
        }

        // Update status
        request.status = status;
        await request.save();

        res.json(request);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   PUT /api/services/:id/progress-image
// @desc    Upload progress images for a job in progress
// @access  Private
exports.uploadProgressImage = async (req, res) => {
    try {
        const request = await ServiceRequest.findById(req.params.id);
        
        if (!request) {
            return res.status(404).json({ message: 'Service request not found' });
        }

        if (req.user.role !== 'Worker' || !request.worker || request.worker.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Only the assigned worker can upload progress images' });
        }

        if (request.status !== 'In Progress') {
            return res.status(400).json({ message: 'Can only upload images while job is in progress' });
        }

        const { imageUrl } = req.body;
        if (!imageUrl) {
            return res.status(400).json({ message: 'No image URL provided' });
        }

        request.progressImages.push(imageUrl);
        await request.save();

        res.json(request);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
