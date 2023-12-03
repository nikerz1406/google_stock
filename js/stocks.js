import endpoints from '../config/api.js'
export default class Stocks{
    constructor(el){
        
    }
    static row = function(data){
        var name = data.stock ? data.stock.toUpperCase() : '';
        var vector = data.vector ? data.vector : 'eq';
        var price = data.price ? data.price : 0;
        return `<td>${ name }</td><td><div class="${ vector }">${ price }</div></td>`;
    }
    static renderStocks =  function(stocks){
        stocks.forEach(async stock => {
            var data = await Stocks.getPrice(stock);
            var td = document.createElement("tr");
            td.innerHTML = Stocks.row(data);
            document.getElementById("stocks").getElementsByTagName("tbody")[0].append(td);
        });
    }
    static getPrice = async function(stock){
        var url = endpoints + stock.name + "/" + stock.server ;
        return await fetch(url)
        .then(response => response.json())
        .then(res => {
            return res.data;
        });
    }
    static getPriceWithServer = async function (stock,server = '') {

        // enum server : [1,2,3,all,'']
        var url = endpoints + stock +'/'+server;
        return await fetch(url)
        .then(response => response.json())
        .then(res => {
            return res.data.stock;
        });
    }
}