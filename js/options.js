import Stocks from './stocks.js';

chrome.storage.sync.get("stocks", ({ stocks }) => {
    Options.renderStocks(stocks);
});

/**
 * Options class handles UI and storage for stock options.
 */
class Options {
    constructor() {
        this.addEventListener();
    }

    /**
     * Render stocks into the table body.
     * @param {Array} stocks
     */
    static renderStocks = (stocks) => {
        const tbody = document.getElementById("stocks").getElementsByTagName("tbody")[0];
        let html = '';
        tbody.innerHTML = '';
        if (stocks && stocks.length) {
            let key = 1;
            for (const s of stocks) {
                html = Options.row({ key, name: s.name, server: s.server });
                key++;
                tbody.appendChild(html);
            }
            return;
        }
        // default empty row
        html = Options.row({ key: 1 });
        tbody.appendChild(html);
    }

    /**
     * Create a table row for a stock.
     * @param {Object} data
     * @returns {HTMLTableRowElement}
     */
    static row = ({ key = 1, name = '', server = 1 }) => {
        const tr = document.createElement("tr");
        tr.dataset.index = key;
        tr.innerHTML = `<td class="align-middle ps-3">${key}</td>
        <td class="align-middle"><input type="text" class="text-uppercase stock-name" name="stock[${key}][name]" value="${name}"></td>
        <td class="align-middle text-center">${Options.bootstrapRadio({ key, value: 1, server })}</td>
        <td class="align-middle text-center">${Options.bootstrapRadio({ key, value: 2, server })}</td>
        <td class="align-middle text-center">${Options.bootstrapRadio({ key, value: 3, server })}</td>
        <td><button class="float-end btn btn-sm btn-outline-danger px-3" data-btn="remove${key}" title="remove row"><i class="fa fa-trash me-1" aria-hidden="true"></i> Remove</button></td>`;
        return tr;
    }

    /**
     * Create a radio input for server selection.
     * @param {Object} data
     * @returns {string}
     */
    static bootstrapRadio = ({ key = 1, value = 1, server = 1 }) => {
        const isCheck = value == server ? 'checked' : '';
        return `<div class="justify-content-center align-items-center">
            <input class="form-check-input" type="radio" name="stock[${key}][server]" value="${value}" ${isCheck}>
        </div>`;
    }

    /**
     * Create a price display with color and icon.
     * @param {Object} data
     * @returns {string}
     */
    static bootstrapPrice = ({ price = '-', vector = 'down' }) => {
        const color = vector === 'up' ? 'success' : (vector === 'down' ? 'danger' : 'warning');
        const icon = vector === 'up' ? 'fa fa-sort-asc' : (vector === 'down' ? 'fa fa-caret-down' : 'fa fa-minus');
        return `<span class="text-${color}">${price}  <i class="ms-1 align-middle ${icon} text-${color}" aria-hidden="true"></i></span>`;
    }

    /**
     * Create a row for server alive status.
     * @param {Object} data
     * @returns {HTMLTableRowElement}
     */
    static rowServerAlive = ({ key = 1, name = '', server = [] }) => {
        const tr = document.createElement("tr");
        tr.dataset.index = key;
        tr.innerHTML = `<td class="align-middle ps-3 ">${key}</td>
        <td class="align-middle text-uppercase">${name}</td>
        <td class="align-middle text-center">${Options.bootstrapPrice(server[0] || {})}</td>
        <td class="align-middle text-center">${Options.bootstrapPrice(server[1] || {})}</td>
        <td class="align-middle text-center">${Options.bootstrapPrice(server[2] || {})}</td>`;
        return tr;
    }

    /**
     * Add all event listeners for the options UI.
     */
    addEventListener = () => {
        document.getElementById("add").addEventListener("click", () => {
            this.add();
            this.save();
        });
        document.getElementById("stocks").getElementsByTagName("tbody")[0].addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') {
                this.remove(e.target);
                this.save();
            }
        });
        document.getElementById("refresh-query").addEventListener('click', () => {
            this.refresh();
        });
    }

    /**
     * Get current stocks from the table.
     * @returns {Array}
     */
    getCurrentStocks = () => {
        const body = document.getElementById("stocks").getElementsByTagName("tbody")[0];
        const nodes = body.querySelectorAll("tr");
        const stocks = [];
        nodes.forEach(e => {
            const txt = e.querySelectorAll("td")[1].getElementsByTagName("input")[0].value;
            const radios = e.getElementsByClassName("form-check-input");
            let server = 1;
            Array.from(radios).forEach(element => {
                if (element.checked) {
                    server = element.value;
                }
            });
            if (txt !== '') stocks.push({ name: txt, server });
        });
        return stocks;
    }

    /**
     * Save current stocks to chrome storage.
     */
    save = () => {
        const stocks = this.getCurrentStocks();
        console.log({ stocks });
        chrome.storage.sync.set({ stocks });
    }

    /**
     * Add a new stock row.
     */
    add = () => {
        const body = document.getElementById("stocks").getElementsByTagName("tbody")[0];
        const nodes = body.querySelectorAll("tr");
        let key = 1;
        if (nodes.length !== 0) {
            const last_node = nodes[nodes.length - 1];
            key = last_node.dataset.index;
            key = key ? parseInt(key) + 1 : 1;
        }
        const html = Options.row({ key });
        body.appendChild(html);
        this.addTriggerFocusSave(html);
    }

    /**
     * Add focusout event to save and refresh when input loses focus.
     * @param {HTMLElement} element
     */
    addTriggerFocusSave = (element) => {
        element.addEventListener('focusout', () => {
            this.save();
            this.refresh();
        });
    }

    /**
     * Refresh the table numbers and price server alive.
     */
    refresh = () => {
        this.refreshNo();
        this.refreshPrice();
    }

    /**
     * Refresh price server alive for all stocks.
     */
    refreshPrice = async () => {
        const stocks = this.getCurrentStocks();
        let key = 1;
        const tbody = document.getElementById("stocks-realtime").getElementsByTagName("tbody")[0];
        tbody.innerHTML = '';
        for (const stock of stocks) {
            const data = await Stocks.getPriceWithServer(stock.name, "all");
            data.key = key;
            const html = Options.rowServerAlive(data);
            tbody.append(html);
            key++;
        }
    }

    /**
     * Refresh row numbers in the table.
     */
    refreshNo = () => {
        let no = 1;
        document.getElementById("stocks").getElementsByTagName("tbody")[0].querySelectorAll("tr").forEach(e => {
            e.getElementsByTagName("td")[0].innerHTML = no;
            no++;
        });
    }

    /**
     * Remove a stock row.
     * @param {HTMLElement} el
     */
    remove = (el) => {
        el.closest("tr").remove();
        this.refresh();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new Options(document);
});
