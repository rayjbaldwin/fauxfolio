// src/controllers/portfolioController.js
const stockService = require('../services/stockService');

class PortfolioController {
  async getPortfolioValuesByDateRange(req, res) {
    try {
      const { startDate, endDate } = req.query;
      const portfolioItems = req.body.items; // Array of {ticker, shares}

      if (!startDate || !endDate || !portfolioItems) {
        return res.status(400).json({
          error: 'Missing required parameters: startDate, endDate, and portfolio items'
        });
      }

      // First ensure we have all the stock data we need
      for (const item of portfolioItems) {
        await stockService.getOrFetchStockPrices(item.ticker, startDate, endDate);
      }

      // Then calculate the portfolio values
      const portfolioValues = await stockService.calculatePortfolioValuesByDateRange(
        portfolioItems,
        startDate,
        endDate
      );

      return res.json({
        startDate,
        endDate,
        totalDays: portfolioValues.length,
        portfolioValues
      });
    } catch (error) {
      console.error('Error in getPortfolioValuesByDateRange controller:', error);
      return res.status(500).json({ error: 'Failed to calculate portfolio values' });
    }
  }


}

module.exports = new PortfolioController();
