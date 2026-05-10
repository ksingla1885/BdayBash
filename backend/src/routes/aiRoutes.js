import express from 'express';
import { generateWish } from '../controllers/aiController.js';

const router = express.Router();

router.post('/generate-wish', generateWish);

export default router;
