import { Router } from 'express';
import {
  getGuests,
  getSingleGuests,
  createGuests,
  updateGuest,
  deleteGuests,
} from '../controllers/guests';
import { UserRole } from '../helpers/types';
import { authorize, protect } from '../middleware/auth';

const router = Router();

router
  .route('/')
  .get(protect, authorize(UserRole.PUBLISHER, UserRole.ADMIN), getGuests)
  .post(protect, authorize(UserRole.PUBLISHER, UserRole.ADMIN), createGuests);

router
  .route('/:id')
  .get(protect, authorize(UserRole.PUBLISHER, UserRole.ADMIN), getSingleGuests)
  .put(updateGuest)
  .delete(protect, authorize(UserRole.PUBLISHER, UserRole.ADMIN), deleteGuests);

export default router;
