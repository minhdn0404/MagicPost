const express = require('express');
const transstaffController = require('../controllers/transstaffController')

const router = express.Router();

// Transstaff home page
router.get('/', transstaffController.transstaff_index)

// Create a shipment to send to the gather point
router.post('/shipments', transstaffController.transstaff_shipment_create)

// Update shipment
router.put('/shipments/:id', transstaffController.transstaff_shipment_update)

// Delete shipment
router.delete('/shipments/:id', transstaffController.transstaff_shipment_delete)


module.exports = router;
