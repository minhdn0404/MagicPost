import express from 'express';
import managerController from '../controllers/managerController.js';

const router = express.Router();

// Manager home page
router.get('/', managerController.manager_index);

// Get all points
router.get('/points', managerController.manager_points);

// Create a new point
router.post('/points', managerController.manager_create_point);

// Get a point info
router.get('/points/:id', managerController.manager_point_details)

// Delete a point
router.delete('/points/:id', managerController.manager_point_delete)

export default router;