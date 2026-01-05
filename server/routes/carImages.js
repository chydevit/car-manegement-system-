const express = require('express');
const { authRequired } = require('../middleware/auth');
const { upload, processImages, validateImageDimensions } = require('../middleware/imageUpload');
const {
    createCarImage,
    getCarImages,
    updateCarImage,
    deleteCarImage,
    setPrimaryImage,
} = require('../models/carImage');
const { findById: findCarById } = require('../models/car');

const router = express.Router();

// Get all images for a car
router.get('/:carId/images', async (req, res) => {
    try {
        const { carId } = req.params;
        const images = await getCarImages(carId);
        res.json(images);
    } catch (error) {
        console.error('Error fetching car images:', error);
        res.status(500).json({ error: 'Failed to fetch car images' });
    }
});

// Upload new image(s) for a car
router.post(
    '/:carId/images',
    authRequired,
    upload.array('images', 10), // Max 10 images
    validateImageDimensions,
    processImages,
    async (req, res) => {
        try {
            const { carId } = req.params;
            const { user } = req;

            // Check if car exists
            const car = await findCarById(carId);
            if (!car) {
                return res.status(404).json({ error: 'Car not found' });
            }

            // Check ownership (seller must own the car, or user must be admin)
            if (user.role !== 'admin' && car.sellerId !== user.id) {
                return res.status(403).json({ error: 'You do not have permission to upload images for this car' });
            }

            // Check current image count
            const existingImages = await getCarImages(carId);
            const totalImages = existingImages.length + (req.processedImages?.length || 0);

            if (totalImages > 10) {
                return res.status(400).json({
                    error: `Cannot upload images. Maximum of 10 images allowed per car. Current: ${existingImages.length}`,
                });
            }

            if (!req.processedImages || req.processedImages.length === 0) {
                return res.status(400).json({ error: 'No images provided' });
            }

            // Determine if this is the first image (should be primary)
            const isPrimary = existingImages.length === 0;

            // Create image records
            const createdImages = [];
            for (let i = 0; i < req.processedImages.length; i++) {
                const image = req.processedImages[i];
                const displayOrder = existingImages.length + i;

                const createdImage = await createCarImage(
                    carId,
                    image.dataUrl,
                    isPrimary && i === 0, // Only first image is primary if no existing images
                    displayOrder
                );

                createdImages.push(createdImage);
            }

            res.status(201).json({
                message: `Successfully uploaded ${createdImages.length} image(s)`,
                images: createdImages,
            });
        } catch (error) {
            console.error('Error uploading car images:', error);
            res.status(500).json({ error: 'Failed to upload images' });
        }
    }
);

// Update image metadata (primary status, display order)
router.put('/:carId/images/:imageId', authRequired, async (req, res) => {
    try {
        const { carId, imageId } = req.params;
        const { isPrimary, displayOrder } = req.body;
        const { user } = req;

        // Check if car exists
        const car = await findCarById(carId);
        if (!car) {
            return res.status(404).json({ error: 'Car not found' });
        }

        // Check ownership
        if (user.role !== 'admin' && car.sellerId !== user.id) {
            return res.status(403).json({ error: 'You do not have permission to update images for this car' });
        }

        // If setting as primary, use setPrimaryImage to ensure only one primary
        if (isPrimary === true) {
            const updatedImage = await setPrimaryImage(carId, imageId);
            if (!updatedImage) {
                return res.status(404).json({ error: 'Image not found' });
            }
            return res.json({ message: 'Primary image updated', image: updatedImage });
        }

        // Otherwise, update normally
        const patch = {};
        if (isPrimary !== undefined) patch.isPrimary = isPrimary;
        if (displayOrder !== undefined) patch.displayOrder = displayOrder;

        const updatedImage = await updateCarImage(imageId, patch);
        if (!updatedImage) {
            return res.status(404).json({ error: 'Image not found' });
        }

        res.json({ message: 'Image updated', image: updatedImage });
    } catch (error) {
        console.error('Error updating car image:', error);
        res.status(500).json({ error: 'Failed to update image' });
    }
});

// Delete a car image
router.delete('/:carId/images/:imageId', authRequired, async (req, res) => {
    try {
        const { carId, imageId } = req.params;
        const { user } = req;

        // Check if car exists
        const car = await findCarById(carId);
        if (!car) {
            return res.status(404).json({ error: 'Car not found' });
        }

        // Check ownership
        if (user.role !== 'admin' && car.sellerId !== user.id) {
            return res.status(403).json({ error: 'You do not have permission to delete images for this car' });
        }

        // Get all images for this car
        const images = await getCarImages(carId);
        const imageToDelete = images.find(img => img.id === Number(imageId));

        if (!imageToDelete) {
            return res.status(404).json({ error: 'Image not found' });
        }

        // Delete the image
        const deleted = await deleteCarImage(imageId);
        if (!deleted) {
            return res.status(404).json({ error: 'Image not found' });
        }

        // If deleted image was primary and there are remaining images, set first one as primary
        if (imageToDelete.isPrimary && images.length > 1) {
            const remainingImages = images.filter(img => img.id !== Number(imageId));
            if (remainingImages.length > 0) {
                await setPrimaryImage(carId, remainingImages[0].id);
            }
        }

        res.json({ message: 'Image deleted successfully' });
    } catch (error) {
        console.error('Error deleting car image:', error);
        res.status(500).json({ error: 'Failed to delete image' });
    }
});

module.exports = router;
