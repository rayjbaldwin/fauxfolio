const pool = require('../db');

async function listStocks(req, res) {
  try {
    const result = await pool.query('SELECT ticker, name FROM stocks ORDER BY ticker');
    res.json(result.rows);
  } catch (err) {
    console.error('Error listing stocks:', err);
    res.status(500).json({ message: 'Could not list stocks' });
  }
}

async function saveStockPrice(ticker, date, closePrice) {
  const query = `
    INSERT INTO historical_prices (ticker, date, close_price)
    VALUES ($1, $2, $3)
    ON CONFLICT (ticker, date) DO UPDATE SET close_price = EXCLUDED.close_price;
  `;
  try {
    await pool.query(query, [ticker, date, closePrice]);
    console.log(`Saved ${ticker} on ${date}`);
  } catch (error) {
    console.error("Error saving stock price:", error.message);
  }
}

module.exports = { saveStockPrice, listStocks };
