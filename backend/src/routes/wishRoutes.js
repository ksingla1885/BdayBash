import express from 'express';
import { upload } from '../config/cloudinary.js';
import { createWish, getWish, generateMessage } from '../controllers/wishController.js';

const router = express.Router();

router.post('/create', upload.fields([{ name: 'images', maxCount: 10 }, { name: 'music', maxCount: 1 }]), createWish);
router.get('/:slug', getWish);
router.post('/generate-message', generateMessage);

export default router;
