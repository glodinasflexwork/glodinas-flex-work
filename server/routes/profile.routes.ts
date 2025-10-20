import { Router } from 'express';
import { getProfile, createProfile, updateProfile, getPublicProfile } from '../controllers/profile.controller.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, requireRole(['job_seeker']), getProfile);
router.post('/', authenticate, requireRole(['job_seeker']), createProfile);
router.put('/', authenticate, requireRole(['job_seeker']), updateProfile);
router.get('/:id', authenticate, getPublicProfile);

export default router;

