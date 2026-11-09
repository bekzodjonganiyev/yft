import { Router } from 'express';
import { login, register, getMe } from '../controllers/auth.controller';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

router.post('/login', login);
// Only an existing admin may create new admin/manager accounts.
router.post('/register', authenticate, requireAdmin, register);
router.get('/me', authenticate, getMe);

export default router;
