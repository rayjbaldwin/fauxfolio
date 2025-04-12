const pool = require('../db');

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

module.exports = { saveStockPrice };
