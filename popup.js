import Stocks from './stocks.js';
chrome.storage.sync.get("stocks", ({ stocks }) => {
    if(!stocks) return;
    Stocks.renderStocks(stocks);
  });