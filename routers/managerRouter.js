import express from 'express';
import managerController from '../controllers/managerController.js';

const router = express.Router();

// Manager home page
router.get('/', managerController.manager_index);

// Get all points
router.get('/points', managerController.manager_points_get);

// Create a new point
router.post('/points', managerController.manager_point_create);

// Update point info
router.put('/points/:id', managerController.manager_point_update)

// Get a point info
router.get('/points/:id', managerController.manager_point_details)

// Delete a point
router.delete('/points/:id', managerController.manager_point_delete)

// Get captains list
router.get('/accounts', managerController.manager_captain_get)

// Create new captain info
router.post('/accounts', managerController.manager_captain_get_points)

// Create new captain account
router.post('/accounts/captain', managerController.manager_captain_create)

// Get a captain info
router.get('/accounts/:id', managerController.manager_captain_details)

// Update captain info
router.put('/accounts/:id', managerController.manager_captain_update)

// Delete captain account
router.delete('/accounts/:id', managerController.manager_captain_delete)

export default router;