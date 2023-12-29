import express from 'express';
import transstaffController from '../controllers/transstaffController.js';

const router = express.Router();

// Transstaff home page
router.get('/', transstaffController.transstaff_index)

// Create a shipment to send to the gather point
router.post('/shipments', transstaffController.transstaff_shipment_create)

// Generate shipment code for customer
router.get('/shipments/guide', transstaffController.transstaff_generate_guide)

// Update shipment info
router.put('/shipments/:id', transstaffController.transstaff_shipment_update_info)

// Delete shipment
router.delete('/shipments/:id', transstaffController.transstaff_shipment_delete)

// Send shipment to gather point
router.put('/shipments/:id/send', transstaffController.transstaff_shipment_send_to_gather)

// Verify shipment from gather point
router.post('/shipments/:id/confirm-shipment', transstaffController.transstaff_shipment_verify_from_gather)

// Send to shipment tp receiver
router.post('/shipments/:id/create-delivery', transstaffController.transstaff_shipment_send_to_receiver)

// Verify that shipment is deliverd successfully
router.post('/shipments/:id/confirm-delivery', transstaffController.transstaff_shipment_verify_to_receiver)

// Verify that shipment not received by receiver and returned to trans point
router.post('/shipments/:id/return/', transstaffController.transstaff_shipment_verify_returned)

// Statistic of shipment
router.get('/shipments/statistics', transstaffController.transstaff_shipment_statistic)

export default router;
