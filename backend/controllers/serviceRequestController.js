const User = require('../models/User');
const ServiceRequest = require('../models/ServiceRequest');
const { GoogleGenerativeAI } = require('@google/generative-ai');


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
        const { status, paymentMethod } = req.body;
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
        
        // Store payment method when marking as Paid
        if (status === 'Paid' && paymentMethod) {
            request.paymentMethod = paymentMethod;
        }

        await request.save();

        // Update worker earnings if job is marked as Paid
        if ((status === 'Paid' || status === 'Completed') && request.worker) {
            await User.findByIdAndUpdate(request.worker, { $inc: { earnings: request.budget } });
        }
        const Notification = require('../models/Notification');
        const notifications = [];
        // Notify customer about status change
        notifications.push(new Notification({
            user: request.customer,
            type: 'JobUpdate',
            title: 'Job status updated',
            body: `Your job "${request.serviceType}" is now ${status}`,
        }));
        // If a worker is assigned, notify them as well
        if (request.worker) {
            notifications.push(new Notification({
                user: request.worker,
                type: 'JobUpdate',
                title: 'Job status updated',
                body: `Job "${request.serviceType}" is now ${status}`,
            }));
        }
        await Notification.insertMany(notifications);
        const populatedRequest = await ServiceRequest.findById(request._id)
            .populate('customer', 'name profileImage location rating reviewsCount')
            .populate('worker', 'name profileImage serviceType rating reviewsCount location');

        res.json(populatedRequest);
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

        const populatedRequest = await ServiceRequest.findById(request._id)
            .populate('customer', 'name profileImage location rating reviewsCount')
            .populate('worker', 'name profileImage serviceType rating reviewsCount location');

        res.json(populatedRequest);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   GET /api/services/suggest-budget
// @desc    Suggest a budget based on service type, location, and description (AI-powered)
// @access  Private
exports.suggestBudget = async (req, res) => {
    try {
        const { serviceType, location, description } = req.query;

        if (!serviceType || !location) {
            return res.status(400).json({ message: 'Service type and location are required' });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        
        // Fallback to rule-based if no API key or if it's the placeholder
        if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
            console.log('Using rule-based fallback for budget suggestion');
            const basePrices = {
                'Plumbing': 50,
                'Electrical': 60,
                'Cleaning': 30,
                'Repair': 40,
                'Painting': 80,
                'Carpentry': 70,
                'Gardening': 35,
                'AC Repair': 55
            };
            const locationMultipliers = {
                'Colombo': 1.5,
                'Kandy': 1.2,
                'Galle': 1.1,
                'Jaffna': 1.0,
                'Other': 0.9
            };

            const basePrice = basePrices[serviceType] || 40;
            const multiplier = locationMultipliers[location] || locationMultipliers['Other'];
            const suggestedBudget = Math.round(basePrice * multiplier * (0.9 + Math.random() * 0.2));

            return res.json({ 
                suggestedBudget, 
                reasoning: "Suggested based on average market rates in your district.",
                isAI: false
            });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
            You are an expert price estimator for a service marketplace platform named "FixNow" in Sri Lanka.
            Task: Suggest a realistic and fair budget in USD for the following job request.
            
            Service Category: ${serviceType}
            Location: ${location}
            Job Description: ${description || 'No description provided'}

            Guidelines:
            1. Consider the complexity of the description if provided.
            2. High-end districts like Colombo should have slightly higher rates.
            3. Return the response in strict JSON format with the following keys:
               - "suggestedBudget": (number) The recommended amount in USD.
               - "reasoning": (string) A brief 1-sentence explanation of why this price was chosen.
               - "breakdown": (string) A short breakdown like "Labor: $X, Materials: $Y".

            Return ONLY the JSON object.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        // Clean up the response if it contains markdown code blocks
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        const aiResponse = JSON.parse(jsonMatch ? jsonMatch[0] : text);

        res.json({ 
            ...aiResponse,
            isAI: true
        });
    } catch (err) {
        console.error('AI Budget Error:', err.message);
        // Secondary fallback if AI fails during execution
        res.status(200).json({ 
            suggestedBudget: 50, 
            reasoning: "Fallback suggestion due to service interruption.",
            isAI: false 
        });
    }
};
