import Stocks from './stocks.js';

chrome.storage.sync.get("stocks", ({ stocks }) => {
    Options.renderStocks(stocks);
  });

class Options{
    constructor(){
        this.addEventListener()
    }
    static renderStocks = function(stocks){
        var tbody = document.getElementById("stocks").getElementsByTagName("tbody")[0];
        var html = '';
        if(stocks){
            var key = 1;
            stocks.forEach(function(s){
                
                html = Options.row({key,name : s});
                key++;
                tbody.appendChild(html);
            })
            return;
        }
        
        // default empty row
        html = Options.row({key:1});    
        tbody.appendChild(html);
        
    }
    static row = function(data){
        var key = data.key ? data.key : 1;
        var name = data.name ? data.name : '';
        var tr = document.createElement("tr");
        tr.dataset.index = key;
        tr.innerHTML = `<td class="align-middle ps-3">${ key }</td>
        <td class="align-middle"><input type="text" class="text-uppercase stock-name" name="stock[${key}][name]" value="${name}"></td>
        <td class="align-middle text-center">`+Options.bootstrapRadio({key,value:1})+`</td>
        <td class="align-middle text-center">`+Options.bootstrapRadio({key,value:2})+`</td>
        <td class="align-middle text-center">`+Options.bootstrapRadio({key,value:3})+`</td>
        <td><button class="float-end btn btn-sm btn-outline-danger px-3" data-btn="remove${key}" title="remove row"><i class="fa fa-trash me-1" aria-hidden="true"></i> Remove</button></td>`;
        return tr;
    
    }
    static bootstrapRadio = function(data){
        var key = data.key ? data.key : 1;
        var value = data.value ? data.value : 1;
        var isCheck = value == 1 ? 'checked' : '';
        return `<div class="justify-content-center align-items-center">
            <input class="form-check-input" type="radio" name="stock[${key}][server] value="${value}" ${isCheck}>
        </div>`
    }
    static bootstrapPrice = function(data){
        var price = data.price ? data.price : '-';
        var color = data.vector ? ( data.vector == 'up' ? 'success' : (data.vector == 'down' ? 'danger' : 'warning')) : 'danger';
        var icon = data.vector ? ( data.vector == 'up' ? 'fa fa-sort-asc' : (data.vector == 'down' ? 'fa fa-caret-down' : 'fa fa-minus')) : 'fa fa-caret-down';
        return `<span class="text-${color}">${price}  <i class="ms-1 align-middle ${icon} text-${color}" aria-hidden="true"></i></span>`;
    }
    static rowServerAlive = function(data){
        var key = data.key ? data.key : 1;
        var name = data.name ? data.name : '';
        var tr = document.createElement("tr");
        tr.dataset.index = key;
        tr.innerHTML = `<td class="align-middle ps-3 ">${ key }</td>
        <td class="align-middle text-uppercase">${name}</td>
        <td class="align-middle text-center">`+Options.bootstrapPrice(data)+`</td>
        <td class="align-middle text-center">-</td>
        <td class="align-middle text-center">-</td>`;
        return tr;
    }
}

Options.prototype.addEventListener = function(){
    var _this = this;
    document.getElementById("add").addEventListener("click",function(){
        _this.add();
        _this.save();
    })

    document.getElementById("stocks").getElementsByTagName("tbody")[0].addEventListener('click',function(e){
        if(e.target.tagName == 'BUTTON'){
            //do something
            _this.remove(e.target);
            _this.save();
        }
    })


    document.getElementById("refresh-query").addEventListener('click',function(){
        _this.refresh();
    })
}
Options.prototype.getCurrentStocks = function(){
    var body = document.getElementById("stocks").getElementsByTagName("tbody")[0];
    var nodes = body.querySelectorAll("tr");
    var stocks = [];
    nodes.forEach(function(e){
        var txt = e.querySelectorAll("td")[1].getElementsByTagName("input")[0].value;
        if(txt!='') stocks.push(txt);
    })
    return stocks;
}
Options.prototype.save = function(){
    var stocks = this.getCurrentStocks();
    chrome.storage.sync.set({ stocks });
}
Options.prototype.add = function(){
    var body = document.getElementById("stocks").getElementsByTagName("tbody")[0];
    var nodes = body.querySelectorAll("tr");
    var key = 1;
    if(nodes.length != 0){
        var last_node = nodes[nodes.length -1];
        key = last_node.dataset.index;
        key = key ? parseInt(key)+1 : 1;
    }
    
    var html = Options.row({key});
    body.appendChild(html);
    this.addTriggerFocusSave(html);
    // setTimeout(()=>{
    //     _this.refresh();
    //     console.log("refresh run")
    // },100)
    
}
Options.prototype.addTriggerFocusSave = function(element){
    var _this = this;
    element.addEventListener('focusout',function(){
        _this.save();
        _this.refresh();
    })
    
}
Options.prototype.refresh = function (){
    // reset number table
    this.refreshNo();
    // reset price server alive
    this.refreshPrice();
}
Options.prototype.refreshPrice = function(){
    var stocks = this.getCurrentStocks();
    var key = 1;
    var tbody = document.getElementById("stocks-realtime").getElementsByTagName("tbody")[0];
    tbody.innerHTML = '';
    stocks.forEach(async stock => {
        var data = await Stocks.getPrice(stock);
        data.key = key;
        var html = Options.rowServerAlive(data);
        tbody.append(html);
        key++;
    });
}
Options.prototype.refreshNo = function(){
    let no = 1;
    document.getElementById("stocks").getElementsByTagName("tbody")[0].querySelectorAll("tr").forEach(e=>{
        e.getElementsByTagName("td")[0].innerHTML = no;
        no++;
    })
}
Options.prototype.remove = function(el){
    el.closest("tr").remove();
    this.refresh();
}
document.addEventListener("DOMContentLoaded", () => {
    new Options(document);
});
