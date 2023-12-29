import express from 'express';
import customerController from '../controllers/customerController.js';

const router = express.Router();

router.get('/tracking', customerController.customer_tracking)

export default router;