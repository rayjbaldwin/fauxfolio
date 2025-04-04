const express = require('express');
const portfolioController = require('../controllers/portfolioController');

const router = express.Router();

router.post('/values-filled', portfolioController.getPortfolioValuesByDateRange);

module.exports = router;
