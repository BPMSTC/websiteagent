import express from 'express';
import multer from 'multer';
import { upload as cloudinaryUpload, uploadFromUrl } from '../services/cloudinary.js';
import { generate as generateImage } from '../services/imageGen.js';

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Upload image file
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const url = await cloudinaryUpload(req.file.buffer);
    res.json({ url });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// Generate image with AI
router.post('/generate', async (req, res) => {
  try {
    const { prompt, style } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt required' });
    }

    // Generate with DALL-E
    const imageUrl = await generateImage(prompt, style);

    // Upload to Cloudinary for permanent hosting
    const permanentUrl = await uploadFromUrl(imageUrl);

    res.json({ url: permanentUrl });

  } catch (error) {
    console.error('Image generation error:', error);
    res.status(500).json({ error: 'Failed to generate image' });
  }
});

export default router;
