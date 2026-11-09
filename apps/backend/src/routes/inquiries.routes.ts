import { Router } from 'express';
import {
  getInquiries,
  createInquiry,
  updateInquiryStatus,
  deleteInquiry,
} from '../controllers/inquiries.controller';
import { authenticate } from '../middleware/auth';
import { attachmentUpload } from '../middleware/upload';

const router = Router();

// Public route to submit inquiry from user frontend
router.post('/', attachmentUpload.single('attachment'), createInquiry);

// Protected admin routes
router.get('/', authenticate, getInquiries);
router.patch('/:id/status', authenticate, updateInquiryStatus);
router.delete('/:id', authenticate, deleteInquiry);

export default router;
