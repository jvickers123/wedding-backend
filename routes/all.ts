import { Router } from 'express';
import { getGuestsAndAccomodation } from '../controllers/all';
import { UserRole } from '../helpers/types';
import { authorize, protect } from '../middleware/auth';

const router = Router();

router
  .route('/')
  .get(
    protect,
    authorize(UserRole.PUBLISHER, UserRole.ADMIN),
    getGuestsAndAccomodation
  );

export default router;
