import { Router } from 'express';
import { saveJob, unsaveJob, getSavedJobs } from '../controllers/savedJobs.controller.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = Router();

router.post('/', authenticate, requireRole(['job_seeker']), saveJob);
router.delete('/:jobId', authenticate, requireRole(['job_seeker']), unsaveJob);
router.get('/', authenticate, requireRole(['job_seeker']), getSavedJobs);

export default router;

