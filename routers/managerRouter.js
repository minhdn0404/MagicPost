const express = require('express');
const managerController = require('../controllers/managerController');

const router = express.Router();

// Manager home page
router.get('/', managerController.manager_index);

router.get('/points', managerController.manager_points);

router.post('/points', managerController.manager_create_point);

module.exports = router;