// src/services/marketCalendarService.js
const nyse = require('nyse-holidays');

class MarketCalendarService {
  isTradingDay(date) {
    const d = new Date(date);
    const day = d.getDay();

    // Check if it's a weekend
    if (day === 0 || day === 6) {
      return false;
    }

    // Check if it's a holiday
    return !nyse.isHoliday(d);
  }

  getTradingDays(startDate, endDate) {
    const tradingDays = [];
    const start = new Date(startDate);
    const end = new Date(endDate);

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      if (this.isTradingDay(d)) {
        tradingDays.push(dateStr);
      }
    }

    return tradingDays;
  }
}

module.exports = new MarketCalendarService();
