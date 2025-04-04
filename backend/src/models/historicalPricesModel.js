const pool = require("../db");

// Save stock price to the database
async function saveStockPrice(ticker, date, closePrice) {
  const query = `
        INSERT INTO historical_prices (ticker, date, close_price)
        VALUES ($1, $2, $3)
    `;

  await pool.query(query, [ticker, date, closePrice]);
}

// Retrieve stock price from database
async function getStockPrice(ticker, date) {
  const query = `SELECT * FROM historical_prices WHERE ticker = $1 AND date = $2`;
  const result = await pool.query(query, [ticker, date]);

  return result.rows[0];
}

module.exports = { saveStockPrice, getStockPrice };
