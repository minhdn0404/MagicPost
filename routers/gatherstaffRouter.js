import express from 'express';
import gatherstaffController from '../controllers/gatherstaffController.js';

const router = express.Router();

// Gatherstaff home page
router.get('/', gatherstaffController.gatherstaff_index)

// Verify shipment sent from a trans point
router.post('/shipments', gatherstaffController.gatherstaff_shipment_verify_from_trans)

// Sending shipment to the target gather point
router.post('/shipments/:id/create-point', gatherstaffController.gatherstaff_shipment_send_to_gather)

// Verify shipment sent from a gather point
router.post('/shipments/:id/confirm-point', gatherstaffController.gatherstaff_shipment_verify_from_gather)

// Sending shipment to the target trans point
router.post('/shipments/:id/create', gatherstaffController.gatherstaff_shipment_send_to_trans)

export default router;