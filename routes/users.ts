import { Router } from 'express';
import {
  getAllusers,
  getSingleUsers,
  updateUser,
  createUser,
  deleteUser,
} from '../controllers/users';
import { UserRole } from '../helpers/types';
import { authorize, protect } from '../middleware/auth';

const router = Router();

router.use(protect);
router.use(authorize(UserRole.ADMIN));

router.route('/').get(getAllusers).post(createUser);

router.route('/:id').get(getSingleUsers).put(updateUser).delete(deleteUser);

export default router;
