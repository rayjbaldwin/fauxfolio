
const axios = require('axios');

const POLYGON_API_KEY = process.env.POLYGON_API_KEY;
const BASE_URL = 'https://api.polygon.io';

class PolygonService {
  async getStockClosePrices(ticker, startDate, endDate) {
    try {
      // Format dates to YYYY-MM-DD
      const formattedStartDate = new Date(startDate).toISOString().split('T')[0];
      const formattedEndDate = new Date(endDate).toISOString().split('T')[0];

      const url = `${BASE_URL}/v2/aggs/ticker/${ticker}/range/1/day/${formattedStartDate}/${formattedEndDate}?apiKey=${POLYGON_API_KEY}`;

      const response = await axios.get(url);

      if (response.data.resultsCount === 0) {
        return [];
      }

      // Only extract the ticker, date, and close price
      return response.data.results.map(result => ({
        ticker,
        date: new Date(result.t).toISOString().split('T')[0],
        close_price: result.c
      }));
    } catch (error) {
      console.error(`Error fetching data for ${ticker}:`, error.message);
      throw error;
    }
  }
}

module.exports = new PolygonService();
