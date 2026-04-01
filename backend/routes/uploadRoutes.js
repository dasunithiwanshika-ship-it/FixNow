const express = require('express');
const router = express.Router();
const upload = require('../utils/upload');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

// @route   POST /api/upload
// @desc    Upload an image for profile or job
// @access  Private
router.post('/', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        
        // Return the path to the uploaded file so frontend can save it to the DB
        const filePath = `/uploads/${req.file.filename}`;
        
        res.json({ 
            message: 'File uploaded successfully', 
            filePath: filePath 
        });
    } catch (error) {
        console.error('Upload Error:', error);
        res.status(500).json({ message: 'Error uploading file' });
    }
});

module.exports = router;
