class Stocks{
    constructor(el){
        this.doc = el;
        this.getPrice("VCB");
    }
}
Stocks.prototype.getPrice = function(stock){
    var _this = this;
    fetch('https://api.khochangchang.com/api/stocks/acb')
    .then(response => response.json())
    .then(data => {
        console.log(data)
        var td = _this.doc.createElement("tr");
        td.innerHTML = `<td>${ data.name }</td><td><div class="${ data.vector }">${ data.price }</div></td>`
        _this.doc.getElementById("stocks").getElementsByTagName("tbody")[0].append(td);
    });
}
new Stocks(document);