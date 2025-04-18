const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolioController');
const { authenticateToken } = require('../middleware/authMiddleware');

// router.use(authenticateToken);
router.post('/', portfolioController.createPortfolio);
router.get('/:id', portfolioController.getPortfolio);
router.put('/:id', portfolioController.updatePortfolio);
router.get('/:id/simulate',portfolioController.simulatePortfolio);
module.exports = router;
