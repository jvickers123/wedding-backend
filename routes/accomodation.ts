import { Router } from 'express';
import {
  getAllAccomodation,
  getSingleAccomodation,
  createAccomodation,
  updateAccomodation,
  deleteAccomodation,
} from '../controllers/accomodation';
import { UserRole } from '../helpers/types';
import { authorize, protect } from '../middleware/auth';

const router = Router();

router
  .route('/')
  .get(
    protect,
    authorize(UserRole.PUBLISHER, UserRole.ADMIN),
    getAllAccomodation
  )
  .post(createAccomodation);

router
  .route('/:id')
  .get(getSingleAccomodation)
  .put(
    protect,
    authorize(UserRole.PUBLISHER, UserRole.ADMIN),
    updateAccomodation
  )
  .delete(
    protect,
    authorize(UserRole.PUBLISHER, UserRole.ADMIN),
    deleteAccomodation
  );

export default router;
