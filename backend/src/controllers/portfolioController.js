const pool = require('../db');

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
    const portfolioResult = await pool.query(
      'SELECT * FROM portfolios WHERE id = $1',
      [id]
    );
    if (portfolioResult.rows.length === 0) {
      return res.status(404).json({ message: 'Portfolio not found.' });
    }
    const portfolio = portfolioResult.rows[0];
    const stocksResult = await pool.query(
      'SELECT ticker, shares FROM portfolio_stocks WHERE portfolio_id = $1',
      [id]
    );
    portfolio.stocks = stocksResult.rows;
    res.json(portfolio);
  } catch (error) {
    console.error('Error retrieving portfolio:', error.message);
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

module.exports = {
  createPortfolio,
  getPortfolio,
  updatePortfolio,
};
