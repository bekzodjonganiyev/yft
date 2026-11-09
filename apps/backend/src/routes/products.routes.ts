import { Router } from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/products.controller';
import { authenticate } from '../middleware/auth';
import { imageUpload } from '../middleware/upload';

const router = Router();

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', authenticate, imageUpload.single('image'), createProduct);
router.put('/:id', authenticate, imageUpload.single('image'), updateProduct);
router.delete('/:id', authenticate, deleteProduct);

export default router;
