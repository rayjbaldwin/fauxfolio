const pool = require('../db');
const {fetchStockHistory} = require("../services/polygonService");

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

async function stockHistory(req, res) {
  const { ticker, startDate, endDate } = req.body;
  if (!ticker || !startDate || !endDate) {
    return res.status(400).json({ message: "Ticker, startDate, and endDate are required." });
  }
  try {
    await fetchStockHistory(ticker, startDate, endDate);
    res.json({ message: `Historical data for ${ticker} fetched and stored.` });
  } catch (error) {
    console.error('Error in stockHistory:', error);
    res.status(500).json({ message: "Error fetching history." });
  }
}


module.exports = { saveStockPrice, listStocks, stockHistory };
