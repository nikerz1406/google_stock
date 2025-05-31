import endpoints from '../config/api.js'
/**
 * Stocks class handles fetching and rendering stock data.
 */
export default class Stocks {
    /**
     * @param {HTMLElement} el - The element to attach stock data to (currently unused)
     */
    constructor(el) {
        // Reserved for future use
    }

    /**
     * Generate a table row for a stock.
     * @param {Object} data - Stock data
     * @param {string} data.stock - Stock name
     * @param {string} data.vector - Price direction (e.g., 'up', 'down', 'eq')
     * @param {number} data.price - Stock price
     * @returns {string} HTML string for the table row
     */
    static row = ({ stock = '', vector = 'eq', price = 0 }) => {
        const name = stock.toUpperCase();
        return `<td>${name}</td><td><div class="${vector}">${price}</div></td>`;
    }

    /**
     * Render multiple stocks into the table body with id 'stocks'.
     * @param {Array} stocks - Array of stock objects
     */
    static renderStocks = async (stocks) => {
        const tbody = document.getElementById('stocks').getElementsByTagName('tbody')[0];
        for (const stock of stocks) {
            const data = await Stocks.getPrice(stock);
            const tr = document.createElement('tr');
            tr.innerHTML = Stocks.row(data);
            tbody.append(tr);
        }
    }

    /**
     * Fetch price data for a stock.
     * @param {Object} stock - Stock object with 'name' and 'server'
     * @returns {Promise<Object>} Stock data
     */
    static getPrice = async (stock) => {
        const url = endpoints + stock.name + '/' + stock.server;
        const response = await fetch(url);
        const res = await response.json();
        return res.data;
    }

    /**
     * Fetch price data for a stock with a specific server.
     * @param {string} stock - Stock name
     * @param {string|number} [server=''] - Server identifier
     * @returns {Promise<Object>} Stock data
     */
    static getPriceWithServer = async (stock, server = '') => {
        const url = endpoints + stock + '/' + server;
        const response = await fetch(url);
        const res = await response.json();
        return res.data.stock;
    }
}