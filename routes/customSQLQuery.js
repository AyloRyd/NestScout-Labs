import express from 'express';
import { CustomSQLQueryController } from '../controllers/customSQLQueryController.js';

const router = express.Router();

router.get('/', CustomSQLQueryController.renderForm);
router.post('/run', CustomSQLQueryController.executeQuery);

export default router;