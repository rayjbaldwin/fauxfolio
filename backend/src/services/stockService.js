// src/services/stockService.js
const db = require('../db');
const polygonService = require('./polygonService');

class StockService {
  async getOrFetchStockPrices(ticker, startDate, endDate) {
    try {
      const marketCalendar = require('../services/marketCalendarService');

      // Get only trading days in the range
      const tradingDays = marketCalendar.getTradingDays(startDate, endDate);

      if (tradingDays.length === 0) {
        return [];
      }

      // Check what we already have in the database
      const existingData = await this.getExistingStockPrices(ticker, startDate, endDate);

      // Create a map of existing dates for quick lookup
      const existingDatesMap = new Map();
      existingData.forEach(item => {
        existingDatesMap.set(item.date, true);
      });

      // Find which trading days we're missing
      const missingDays = tradingDays.filter(date => !existingDatesMap.has(date));

      if (missingDays.length > 0) {
        // Fetch from Polygon.io for the entire date range
        // Their API handles trading days automatically
        const newData = await polygonService.getStockClosePrices(ticker, startDate, endDate);

        // Filter to only save records we don't already have
        const newRecords = newData.filter(item => !existingDatesMap.has(item.date));

        if (newRecords.length > 0) {
          await this.saveStockPrices(newRecords);
        }

        // Get all data again
        return await this.getExistingStockPrices(ticker, startDate, endDate);
      }

      return existingData;
    } catch (error) {
      console.error(`Error getting stock prices for ${ticker}:`, error);
      throw error;
    }
  }

  async getExistingStockPrices(ticker, startDate, endDate) {
    const query = `
      SELECT ticker, date, close_price
      FROM stock_prices
      WHERE ticker = $1 AND date BETWEEN $2 AND $3
      ORDER BY date
    `;

    const result = await db.query(query, [ticker, startDate, endDate]);
    return result.rows;
  }

  async saveStockPrices(stockPrices) {
    // For multiple inserts, use a single query with multiple values
    const values = stockPrices.map(p => `('${p.ticker}', '${p.date}', ${p.close_price})`).join(', ');

    if (values.length === 0) return;

    const query = `
      INSERT INTO stock_prices(ticker, date, close_price)
      VALUES ${values}
      ON CONFLICT (ticker, date) DO UPDATE SET
        close_price = EXCLUDED.close_price,
        created_at = CURRENT_TIMESTAMP
    `;

    await db.query(query);
  }

  // New method to calculate portfolio value for a specific date
  async calculatePortfolioValueByDate(portfolioItems, date) {
    try {
      // portfolioItems should be an array of {ticker, shares}
      const tickers = portfolioItems.map(item => item.ticker);

      if (tickers.length === 0) {
        return { date, value: 0 };
      }

      // Get prices for all tickers on this date
      const query = `
        SELECT ticker, close_price
        FROM stock_prices
        WHERE ticker = ANY($1) AND date = $2
      `;

      const result = await db.query(query, [tickers, date]);

      // Create a map for quick lookup
      const priceMap = {};
      result.rows.forEach(row => {
        priceMap[row.ticker] = row.close_price;
      });

      // Calculate total value
      let totalValue = 0;
      portfolioItems.forEach(item => {
        if (priceMap[item.ticker]) {
          totalValue += priceMap[item.ticker] * item.shares;
        }
      });

      return { date, value: totalValue };
    } catch (error) {
      console.error(`Error calculating portfolio value for ${date}:`, error);
      throw error;
    }
  }

  // New method to calculate portfolio values over a date range
  async calculatePortfolioValuesByDateRange(portfolioItems, startDate, endDate) {
    try {
      const marketCalendar = require('../services/marketCalendarService');

      // Get only trading days in the range
      const tradingDays = marketCalendar.getTradingDays(startDate, endDate);

      // Get all stock prices for the portfolio items
      const tickers = portfolioItems.map(item => item.ticker);

      if (tickers.length === 0 || tradingDays.length === 0) {
        return [];
      }

      // Get all relevant prices in one query
      const query = `
      SELECT ticker, date, close_price
      FROM stock_prices
      WHERE ticker = ANY($1) AND date = ANY($2)
      ORDER BY date
    `;

      const result = await db.query(query, [tickers, tradingDays]);

      // Group prices by date
      const pricesByDate = {};
      result.rows.forEach(row => {
        if (!pricesByDate[row.date]) {
          pricesByDate[row.date] = {};
        }
        pricesByDate[row.date][row.ticker] = row.close_price;
      });

      // Calculate portfolio value for each trading day
      const portfolioValues = [];

      tradingDays.forEach(date => {
        // Skip dates with no price data
        if (!pricesByDate[date]) {
          return;
        }

        let dailyValue = 0;
        const prices = pricesByDate[date];
        let hasAllPrices = true;

        // Check if we have prices for all stocks in the portfolio
        portfolioItems.forEach(item => {
          if (!prices[item.ticker]) {
            hasAllPrices = false;
          } else {
            dailyValue += prices[item.ticker] * item.shares;
          }
        });

        // Only add days where we have complete data
        if (hasAllPrices) {
          portfolioValues.push({
            date,
            value: dailyValue
          });
        }
      });

      return portfolioValues.sort((a, b) => new Date(a.date) - new Date(b.date));
    } catch (error) {
      console.error(`Error calculating portfolio values:`, error);
      throw error;
    }
  }
}

module.exports = new StockService();
