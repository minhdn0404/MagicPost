const express = require('express');
const gathercapController = require('../controllers/gathercapController');

const router = express.Router();

// Gathercap home page
router.get('/', gathercapController.gathercap_index)

// Get gather_staffs info
router.get('/accounts', gathercapController.gathercap_staffs_get);

// Create gather_staff acc
router.post('/accounts', gathercapController.gathercap_staff_create);

// Update gather_staff acc
router.put('/accounts/:id', gathercapController.gathercap_staff_update)

// Delete gather_staff acc
router.delete('/accounts/:id', gathercapController.gathercap_staff_delete)

module.exports = router;