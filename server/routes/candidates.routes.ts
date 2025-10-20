import { Router } from 'express';
import { getAllCandidates, getCandidateById } from '../controllers/candidates.controller.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, requireRole(['employer']), getAllCandidates);
router.get('/:id', authenticate, requireRole(['employer']), getCandidateById);

export default router;

