const express = require('express');
const stockController = require('../controllers/stockController');

const router = express.Router();

router.get('/prices', stockController.getStockPrices);

module.exports = router;
