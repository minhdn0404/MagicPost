const express = require('express');
const transcapController = require('../controllers/transcapController');

const router = express.Router();

// Transcap home page
router.get('/:id', transcapController.transcap_index)

module.exports = router;
