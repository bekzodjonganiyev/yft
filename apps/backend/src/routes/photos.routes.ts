import { Router } from 'express';
import { getPhotos, addPhoto, deletePhoto } from '../controllers/photos.controller';
import { authenticate } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

router.get('/', getPhotos);
router.post('/', authenticate, upload.single('photo'), addPhoto);
router.delete('/:id', authenticate, deletePhoto);

export default router;
