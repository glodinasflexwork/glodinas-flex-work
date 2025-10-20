import { Router } from 'express';
import {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getMyJobs,
} from '../controllers/jobs.controller.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = Router();

router.get('/', getAllJobs);
router.get('/my-jobs', authenticate, requireRole(['employer']), getMyJobs);
router.get('/:id', getJobById);
router.post('/', authenticate, requireRole(['employer']), createJob);
router.put('/:id', authenticate, requireRole(['employer']), updateJob);
router.delete('/:id', authenticate, requireRole(['employer']), deleteJob);

export default router;

