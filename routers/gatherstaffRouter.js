const express = require('express');
const gatherstaffController = require('../controllers/gatherstaffController')

const router = express.Router();

// Gatherstaff home page
router.get('/', gatherstaffController.gatherstaff_index)

// Verify shipment sent from a trans point
router.post('/shipments', gatherstaffController.gatherstaff_shipment_verify_from_trans)

module.exports = router;