import { Router } from 'express';
import {
  getAllNotices,
  getSingleNotice,
  createNotice,
  updateNotice,
  deleteNotice,
} from '../controllers/notices';
import { UserRole } from '../helpers/types';
import { authorize, protect } from '../middleware/auth';

const router = Router();

router
  .route('/')
  .get(getAllNotices)
  .post(protect, authorize(UserRole.PUBLISHER, UserRole.ADMIN), createNotice);

router
  .route('/:id')
  .get(getSingleNotice)
  .put(protect, authorize(UserRole.PUBLISHER, UserRole.ADMIN), updateNotice)
  .delete(protect, authorize(UserRole.PUBLISHER, UserRole.ADMIN), deleteNotice);

export default router;
