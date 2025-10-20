import { Router } from 'express';
import {
  applyToJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
} from '../controllers/applications.controller.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = Router();

router.post('/', authenticate, requireRole(['job_seeker']), applyToJob);
router.get('/my-applications', authenticate, requireRole(['job_seeker']), getMyApplications);
router.get('/job/:jobId', authenticate, requireRole(['employer']), getJobApplications);
router.put('/:id/status', authenticate, requireRole(['employer']), updateApplicationStatus);

export default router;

