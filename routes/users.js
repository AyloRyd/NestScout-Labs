import express from 'express';
import { UsersController } from '../controllers/usersController.js';

const router = express.Router();

router.get('/adding-form', UsersController.getAddingForm);
router.get('/:id?', UsersController.getAll);
router.post('/', UsersController.create);
router.post('/delete', UsersController.delete);
router.get('/edit-form/:id', UsersController.getEditForm);
router.post('/update', UsersController.update);

export default router;