import express from 'express';
import { upload } from '../config/cloudinary.js';
import { createWish, getWish, generateMessage, getSignature } from '../controllers/wishController.js';

const router = express.Router();

router.get('/signature', getSignature);
router.post('/create', createWish);
router.get('/:slug', getWish);
router.post('/generate-message', generateMessage);

export default router;
