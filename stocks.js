
export default class Stocks{
    constructor(el){
 
    }
    static row = function(data){
        var name = data.name ? data.name.toUpperCase() : '';
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
        return await fetch('https://api.khochangchang.com/api/stocks/'+stock)
        .then(response => response.json())
        .then(data => {
            return data;
        });
    }
    static renderArrayStocks = function(stocks){
        var data = [];
        stocks.forEach(stock => {
            var item = { name : stock , server : 1 }
            data.push(item);
        });
        let postData = new FormData();
        postData.append('testdata', 123);

        fetch('https://api.khochangchang.com/api/stocks/',{
            headers: {
                // 'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            method: "POST",
            body: JSON.stringify({data})
        })
        .then(response => response.json())
        .then(data =>{

            data.forEach(function(i){
                var td = document.createElement("tr");
                td.innerHTML = Stocks.row(i);
                document.getElementById("stocks").getElementsByTagName("tbody")[0].append(td);
            })
        })
        return data;
    }
}