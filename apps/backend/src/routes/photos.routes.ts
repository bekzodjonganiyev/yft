import { Router } from 'express';
import { getPhotos, addPhoto, updatePhoto, deletePhoto } from '../controllers/photos.controller';
import { authenticate } from '../middleware/auth';
import { imageUpload } from '../middleware/upload';

const router = Router();

router.get('/', getPhotos);
router.post('/', authenticate, imageUpload.single('photo'), addPhoto);
router.put('/:id', authenticate, imageUpload.single('photo'), updatePhoto);
router.delete('/:id', authenticate, deletePhoto);

export default router;
