const express = require('express');
const { getBills, generateBill } = require('../controllers/billController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', getBills);
router.post('/', protect, generateBill);

module.exports = router;
