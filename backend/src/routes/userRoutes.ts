import express from 'express';
import { getProviders, updateProfile } from '../controllers/userController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/providers', getProviders);
router.put('/profile', protect, updateProfile);

export default router;
