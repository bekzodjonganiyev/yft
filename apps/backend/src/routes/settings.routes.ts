import { Router } from 'express';
import { deleteSetting, getSettings, upsertSetting } from '../controllers/settings.controller';
import { authenticate } from '../middleware/auth';
import { imageUpload } from '../middleware/upload';

const router = Router();

router.get('/', getSettings);
router.put('/:key', authenticate, imageUpload.single('file'), upsertSetting);
router.delete('/:key', authenticate, deleteSetting);

export default router;
