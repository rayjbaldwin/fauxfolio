const express = require('express');
const { listStocks, stockHistory } = require('../controllers/stockController');
// const { fetchStockHistory } = require('../services/polygonService');
const { authenticateToken } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', listStocks);

router.post('/history', authenticateToken, stockHistory);

// router.post('/history', async (req, res) => {
//   const { ticker, startDate, endDate } = req.body;
//   if (!ticker || !startDate || !endDate) {
//     return res.status(400).json({ message: "Ticker, startDate, and endDate are required." });
//   }
//   try {
//     await fetchStockHistory(ticker, startDate, endDate);
//     res.json({ message: `Historical data for ${ticker} fetched and stored.` });
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching history.", error: error.message });
//   }
// });

module.exports = router;
