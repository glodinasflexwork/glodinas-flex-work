import { Router } from 'express';
import { getCompany, createCompany, updateCompany } from '../controllers/company.controller.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, requireRole(['employer']), getCompany);
router.post('/', authenticate, requireRole(['employer']), createCompany);
router.put('/', authenticate, requireRole(['employer']), updateCompany);

export default router;

