import express from 'express';
import { ListingsController } from '../controllers/listingsController.js';

const router = express.Router();

router.get('/adding-form', ListingsController.getAddingForm);
router.get('/:id?', ListingsController.getAll);
router.get('/user/:userId', ListingsController.getByUser);
router.post('/', ListingsController.create);
router.post('/delete', ListingsController.delete);
router.get('/edit-form/:id', ListingsController.getEditForm);
router.post('/update', ListingsController.update);

export default router;