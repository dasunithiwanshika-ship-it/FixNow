const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const ServiceRequest = require('../models/ServiceRequest');

// @route   POST /api/payments/create-intent
// @desc    Create a Stripe PaymentIntent for a job
// @access  Private
exports.createPaymentIntent = async (req, res) => {
    try {
        const { id } = req.body;

        const request = await ServiceRequest.findById(id);

        if (!request) {
            return res.status(404).json({ message: 'Service request not found' });
        }

        // Only the customer who posted the job can pay for it
        if (request.customer.toString() !== req.user.id) {
            return res.status(403).json({ message: 'You are not authorized to pay for this job' });
        }

        if (request.status !== 'Completed') {
            return res.status(400).json({ message: 'Job must be completed before payment' });
        }

        // Stripe expects amount in cents
        const amount = Math.round(request.budget * 100);

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'usd',
            automatic_payment_methods: {
                enabled: true,
            },
            metadata: {
                jobId: id,
                customerId: req.user.id
            }
        });

        res.json({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
