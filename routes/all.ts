import { Router } from 'express';
import { getAll } from '../controllers/all';
import { UserRole } from '../helpers/types';
import { authorize, protect } from '../middleware/auth';

const router = Router();

router
  .route('/')
  .get(protect, authorize(UserRole.PUBLISHER, UserRole.ADMIN), getAll);

export default router;
