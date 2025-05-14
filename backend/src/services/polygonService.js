const axios = require('axios');
const moment = require('moment-timezone');
const { stockHistory } = require('../controllers/stockController');
const pool = require('../db');
require('dotenv').config();

const Holidays = require('date-holidays');
const hd = new Holidays('US');

function isTradingDay(mDate) {
  const dayOfWeek = mDate.day();
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return false;
  }
  const holiday = hd.isHoliday(mDate.toDate());
  return !holiday;
}

async function saveStockPrice(ticker, date, closePrice) {
  const q = `
    INSERT INTO historical_prices (ticker, date, close_price)
    VALUES ($1, $2, $3)
    ON CONFLICT (ticker, date)
    DO UPDATE SET close_price = EXCLUDED.close_price;
  `;
  await pool.query(q, [ticker, date, closePrice]);
}

async function fetchStockPrice(ticker, dateStr) {
  try {
    const response = await axios.get(
      `https://api.polygon.io/v1/open-close/${ticker}/${dateStr}`,
      { params: { apiKey: process.env.POLYGON_API_KEY } }
    );

    if (response.data.status !== "OK" || !response.data.close) {
      console.log(`No data for ${ticker} on ${dateStr}`);
      return null;
    }

    return {
      ticker: response.data.symbol,
      date: response.data.from,
      closePrice: response.data.close,
    };
  } catch (error) {
    console.error("Error fetching stock data:", error.message);
    return null;
  }
}

async function getCachedStockPrice(ticker, dateStr) {
  const result = await pool.query(
    'SELECT close_price FROM historical_prices WHERE ticker = $1 AND date = $2',
    [ticker, dateStr]
  );
  if (result.rows.length > 0) {
    console.log(`Cache hit for ${ticker} on ${dateStr}`);
    return {
      stockData: { ticker, date: dateStr, closePrice: result.rows[0].close_price },
      cached: true
    };
  }
  const stockData = await fetchStockPrice(ticker, dateStr);
  if (stockData) {
    console.log(`Cache miss: Fetched and saving ${ticker} on ${dateStr}`);
    await saveStockPrice(stockData.ticker, dateStr, stockData.closePrice);
  }
  return { stockData, cached: false };
}


async function fetchStockHistory(ticker, startDate, endDate) {
  let currentMoment = moment.tz(startDate, 'YYYY-MM-DD', 'America/New_York');
  const endMoment = moment.tz(endDate, 'YYYY-MM-DD', 'America/New_York');

  const fetchPromises = [];

  while (currentMoment.isSameOrBefore(endMoment)) {
    if (isTradingDay(currentMoment)) {
      const dateStr = currentMoment.format('YYYY-MM-DD');
      fetchPromises.push(
        getCachedStockPrice(ticker, dateStr)
          .then(({ stockData, cached }) => {
            if (stockData) {
              if (cached) {
                console.log(`(Cache) ${ticker} on ${dateStr}`);
              } else {
                console.log(`(Saved fresh) ${ticker} on ${dateStr}`);
              }
            }
          })
      );
    } else {
      console.log(`Skipping ${ticker} on ${currentMoment.format('YYYY-MM-DD')}: non-trading day.`);
    }
    currentMoment.add(1, 'days');
  }
  await Promise.all(fetchPromises);
}


module.exports = { fetchStockPrice, fetchStockHistory, isTradingDay };
