const multer = require('multer');
const sharp = require('sharp');

// Configure multer to use memory storage
const storage = multer.memoryStorage();

// File filter to accept only images
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.'), false);
    }
};

// Multer configuration
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
});

// Middleware to process and compress images
async function processImages(req, res, next) {
    if (!req.files || req.files.length === 0) {
        return next();
    }

    try {
        const processedImages = [];

        for (const file of req.files) {
            // Compress and resize image
            const processedBuffer = await sharp(file.buffer)
                .resize(1920, 1080, {
                    fit: 'inside',
                    withoutEnlargement: true,
                })
                .jpeg({ quality: 80 })
                .toBuffer();

            // Convert to base64 data URL
            const base64Image = `data:image/jpeg;base64,${processedBuffer.toString('base64')}`;

            processedImages.push({
                originalName: file.originalname,
                mimeType: 'image/jpeg',
                size: processedBuffer.length,
                dataUrl: base64Image,
            });
        }

        // Attach processed images to request
        req.processedImages = processedImages;
        next();
    } catch (error) {
        console.error('Error processing images:', error);
        res.status(500).json({ error: 'Failed to process images' });
    }
}

// Middleware to validate image dimensions
async function validateImageDimensions(req, res, next) {
    if (!req.files || req.files.length === 0) {
        return next();
    }

    try {
        for (const file of req.files) {
            const metadata = await sharp(file.buffer).metadata();

            // Check minimum dimensions
            if (metadata.width < 100 || metadata.height < 100) {
                return res.status(400).json({
                    error: `Image ${file.originalname} is too small. Minimum dimensions are 100x100px.`,
                });
            }

            // Check maximum dimensions
            if (metadata.width > 10000 || metadata.height > 10000) {
                return res.status(400).json({
                    error: `Image ${file.originalname} is too large. Maximum dimensions are 10000x10000px.`,
                });
            }
        }

        next();
    } catch (error) {
        console.error('Error validating image dimensions:', error);
        res.status(500).json({ error: 'Failed to validate images' });
    }
}

module.exports = {
    upload,
    processImages,
    validateImageDimensions,
};
