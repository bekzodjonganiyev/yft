import { Router } from 'express';
import {
  getPartners,
  createPartner,
  updatePartner,
  deletePartner,
} from '../controllers/partners.controller';
import { authenticate } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

router.get('/', getPartners);
router.post('/', authenticate, upload.single('logo'), createPartner);
router.put('/:id', authenticate, upload.single('logo'), updatePartner);
router.delete('/:id', authenticate, deletePartner);

export default router;
