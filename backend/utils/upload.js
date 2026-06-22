const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists and is writable; fall back to memory storage on read-only
const uploadDir = path.join(__dirname, '../uploads');
let useDisk = true;
try {
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
    }
    fs.accessSync(uploadDir, fs.constants.W_OK);
} catch (err) {
    useDisk = false;
    console.warn('Uploads directory not writable — using memory storage for file uploads.');
}

const storage = useDisk
    ? multer.diskStorage({
          destination: (req, file, cb) => cb(null, 'uploads/'),
          filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
      })
    : multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    // only allow images
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Not an image! Please upload only images.'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5 // 5MB limit
    }
});

module.exports = upload;
