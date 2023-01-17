import { Router } from 'express';
import {
  getAllusers,
  getSingleUsers,
  updateUser,
  createUser,
  deleteUser,
} from '../controllers/users';
import { UserRole } from '../helpers/types';
import { advancedResults } from '../middleware/advancedResults';
import { authorize, protect } from '../middleware/auth';
import User from '../models/User';

const router = Router();

router.use(protect);
router.use(authorize(UserRole.ADMIN));

router.route('/').get(advancedResults(User), getAllusers).post(createUser);

router.route('/:id').get(getSingleUsers).put(updateUser).delete(deleteUser);

export default router;
