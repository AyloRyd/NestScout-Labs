import express from 'express';
import { BookingsController } from '../controllers/bookingsController.js';

const router = express.Router();

router.get('/', BookingsController.getAll);
router.get('/adding-form', BookingsController.getAddingForm);
router.get('/user/:userId', BookingsController.getByUser);
router.get('/listing/:listingId', BookingsController.getByListing);
router.post('/', BookingsController.create);
router.post('/delete', BookingsController.delete);
router.post('/:id/update', BookingsController.update);

export default router;