const express = require('express');
const { saveStockPrice } = require('../controllers/stockController');
const { fetchStockHistory } = require('../services/polygonService');

const router = express.Router();

router.post('/history', async (req, res) => {
  const { ticker, startDate, endDate } = req.body;
  if (!ticker || !startDate || !endDate) {
    return res.status(400).json({ message: "Ticker, startDate, and endDate are required." });
  }
  try {
    await fetchStockHistory(ticker, startDate, endDate);
    res.json({ message: `Historical data for ${ticker} fetched and stored.` });
  } catch (error) {
    res.status(500).json({ message: "Error fetching history.", error: error.message });
  }
});

module.exports = router;
