// src/controllers/stockController.js
const stockService = require('../services/stockService');

class StockController {
  async getStockPrices(req, res) {
    try {
      const { ticker, startDate, endDate } = req.query;

      if (!ticker || !startDate || !endDate) {
        return res.status(400).json({
          error: 'Missing required parameters: ticker, startDate, and endDate are required'
        });
      }

      const stockPrices = await stockService.getOrFetchStockPrices(ticker, startDate, endDate);

      return res.json({
        ticker,
        startDate,
        endDate,
        priceCount: stockPrices.length,
        prices: stockPrices
      });
    } catch (error) {
      console.error('Error in getStockPrices controller:', error);
      return res.status(500).json({ error: 'Failed to retrieve stock prices' });
    }
  }
}

module.exports = new StockController();
