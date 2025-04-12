const axios = require('axios');
const moment = require('moment-timezone');
const { saveStockPrice } = require('../controllers/stockController');
require('dotenv').config();

const Holidays = require('date-holidays');
const hd = new Holidays('US');

function isTradingDay(date) {
  const etDate = moment.tz(date, 'America/New_York');
  const dayOfWeek = etDate.day();  // 0 = Sunday, 6 = Saturday
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return false;
  }
  const holiday = hd.isHoliday(etDate.toDate());
  return !holiday;
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

async function fetchStockHistory(ticker, startDate, endDate) {
  let currentDate = new Date(startDate);
  const finalDate = new Date(endDate);

  while (currentDate <= finalDate) {
    const etDate = moment.tz(currentDate, 'America/New_York');
    if (isTradingDay(currentDate)) {
      const dateStr = etDate.format('YYYY-MM-DD');
      const stockData = await fetchStockPrice(ticker, dateStr);
      if (stockData) {
        await saveStockPrice(
          stockData.ticker,
          stockData.date,
          stockData.closePrice
        );
      }
    } else {
      console.log(`Skipping ${ticker} on ${etDate.format('YYYY-MM-DD')}: non-trading day.`);
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
}

module.exports = { fetchStockPrice, fetchStockHistory, isTradingDay };
