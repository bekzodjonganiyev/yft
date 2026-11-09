import { Router } from 'express';
import { listMedia, removeMedia, uploadMedia } from '../controllers/media.controller';
import { authenticate } from '../middleware/auth';
import { imageUpload } from '../middleware/upload';

const router = Router();

router.get('/', authenticate, listMedia);
router.post('/', authenticate, imageUpload.single('file'), uploadMedia);
router.delete('/:id', authenticate, removeMedia);

export default router;
