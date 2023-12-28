const express = require('express');
const gatherstaffController = require('../controllers/gatherstaffController')

const router = express.Router();

// Gatherstaff home page
router.get('/', gatherstaffController.gatherstaff_index)

// Verify shipment sent from a trans point
router.post('/shipments', gatherstaffController.gatherstaff_shipment_verify_from_trans)

// Sending shipment to the target gather point
router.post('/shipments/:id/create-point', gatherstaffController.gatherstaff_shipment_send_to_gather)

// Verify shipment sent from a gather point
router.post('/shipments/:id/confirm-point', gatherstaffController.gatherstaff_shipment_verify_from_gather)

module.exports = router;