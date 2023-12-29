const express = require('express');
const customerController = require('../controllers/customerController');

const router = express.Router();

router.get('/tracking', customerController.customer_tracking)

module.exports = router;