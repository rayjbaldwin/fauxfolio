const pool = require('../db');
const moment = require('moment');

async function createPortfolio(req, res) {
  const { user_id, name } = req.body;
  if (!user_id || !name) {
    return res.status(400).json({ message: 'User ID and portfolio name are required.' });
  }
  try {
    const result = await pool.query(
      `INSERT INTO portfolios (user_id, name)
       VALUES ($1, $2)
       RETURNING *`,
      [user_id, name]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating portfolio:', error.message);
    res.status(500).json({ message: 'Error creating portfolio.' });
  }
}

async function getPortfolio(req, res) {
  const { id } = req.params;
  try {
    const portRes = await pool.query(
      'SELECT id, name, user_id FROM portfolios WHERE id = $1',
      [id]
    );
    if (portRes.rows.length === 0) {
      return res.status(404).json({ message: 'Portfolio not found.' });
    }
    const portfolio = portRes.rows[0];

    if (portfolio.user_id !== req.user.user_id) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    const stocksRes = await pool.query(
      'SELECT ticker, shares FROM portfolio_stocks WHERE portfolio_id = $1',
      [id]
    );
    portfolio.stocks = stocksRes.rows;

    res.json(portfolio);
  } catch (err) {
    console.error('Error retrieving portfolio:', err.message);
    res.status(500).json({ message: 'Error retrieving portfolio.' });
  }
}

async function updatePortfolio(req, res) {
  const { id } = req.params;
  const { stocks } = req.body;
  if (!stocks || !Array.isArray(stocks)) {
    return res.status(400).json({ message: 'A stocks array is required.' });
  }
  try {

    for (const stock of stocks) {
      await pool.query(
        `INSERT INTO portfolio_stocks (portfolio_id, ticker, shares)
         VALUES ($1, $2, $3)
         ON CONFLICT (portfolio_id, ticker)
         DO UPDATE SET shares = EXCLUDED.shares`,
        [id, stock.ticker, stock.shares]
      );
    }
    res.json({ message: 'Portfolio updated successfully.' });
  } catch (error) {
    console.error('Error updating portfolio:', error.message);
    res.status(500).json({ message: 'Error updating portfolio.' });
  }
}

async function simulatePortfolio(req, res) {
  const { id } = req.params;
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res
      .status(400)
      .json({ message: 'startDate and endDate are required.' });
  }
  try {
    const portRes = await pool.query(
      'SELECT user_id FROM portfolios WHERE id = $1',
      [id]
    );
    if (portRes.rows.length === 0) {
      return res.status(404).json({ message: 'Portfolio not found.' });
    }
    if (portRes.rows[0].user_id !== req.user.user_id) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    const stocksRes = await pool.query(
      'SELECT ticker, shares FROM portfolio_stocks WHERE portfolio_id = $1',
      [id]
    );
    const stocks = stocksRes.rows;
    if (stocks.length === 0) {
      return res
        .status(404)
        .json({ message: 'No stocks found for this portfolio.' });
    }
    const DATE_FMT = 'YYYY-MM-DD'
    const dates = [];
    const portfolioVals = [];
    let current = moment(startDate, DATE_FMT);
    const end = moment(endDate, DATE_FMT);

    while (current.isSameOrBefore(end)) {
      const dateStr = current.format(DATE_FMT);
      let totalValue = 0;

      for (const { ticker, shares } of stocks) {
        const priceRes = await pool.query(
          `SELECT close_price
             FROM historical_prices
            WHERE ticker = $1
              AND date <= $2::date
         ORDER BY date DESC
            LIMIT 1`,
          [ticker, dateStr]
        );
        if (priceRes.rows.length > 0) {
          totalValue +=
            parseFloat(priceRes.rows[0].close_price) *
            parseFloat(shares);
        }
      }

      dates.push(dateStr);
      portfolioVals.push(totalValue);
      current.add(1, 'days');
    }

    res.json({ dates, portfolio_values: portfolioVals });
  } catch (err) {
    console.error('Error simulating portfolio:', err.message);
    res
      .status(500)
      .json({ message: 'Error simulating portfolio performance.' });
  }
}

async function listPortfolios(req, res) {
  const userId = req.user.user_id;
  try {
    const result = await pool.query(
      `SELECT id, name
         FROM portfolios
        WHERE user_id = $1
     ORDER BY created_at DESC`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error listing portfolios:', err.message);
    res.status(500).json({ message: 'Could not list portfolios.' });
  }
}

module.exports = {
  createPortfolio,
  getPortfolio,
  updatePortfolio,
  simulatePortfolio,
  listPortfolios
};
