chrome.storage.sync.get("stocks", ({ stocks }) => {
    Stocks.renderStocks(stocks);
  });
class Stocks{
    constructor(el){
 
    }
    static row = function(data){
        var name = data.name ? data.name.toUpperCase() : '';
        var vector = data.vector ? data.vector : 'eq';
        var price = data.price ? data.price : 0;
        return `<td>${ name }</td><td><div class="${ vector }">${ price }</div></td>`;
    }
    static renderStocks = function(stocks){
        stocks.forEach(stock => {
            Stocks.getPrice(stock)    
        });
    }
    static getPrice = function(stock){
        
        fetch('https://api.khochangchang.com/api/stocks/'+stock)
        .then(response => response.json())
        .then(data => {
            var td = document.createElement("tr");
            td.innerHTML = Stocks.row(data);
            document.getElementById("stocks").getElementsByTagName("tbody")[0].append(td);
        });
    }
}