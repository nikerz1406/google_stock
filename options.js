
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
        }else{
            html = Options.row({key:1});
            tbody.appendChild(html);
        }
        
    }
    static row = function(data){
        var key = data.key ? data.key : 1;
        var name = data.name ? data.name : '';
        var tr = document.createElement("tr");
        tr.dataset.index = key;
        tr.innerHTML = `<td class="align-middle ps-3">${ key }</td>
        <td class="align-middle"><input type="text" class="text-uppercase" name="stock[${key}][name]" value="${name}"></td>
        <td class="align-middle text-center"><input type="radio" name="stock[${key}][server]" checked value=1 ></td>
        <td class="align-middle text-center"><input type="radio" name="stock[${key}][server]" value=2 ></td>
        <td class="align-middle text-center"><input type="radio" name="stock[${key}][server]" value=3 ></td>
        <td><button class="float-end btn btn-sm btn-outline-danger px-3" data-btn="remove${key}" title="remove row"><i class="fa fa-trash me-1" aria-hidden="true"></i> Remove</button></td>`;
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
}
Options.prototype.save = function(){
    var body = document.getElementById("stocks").getElementsByTagName("tbody")[0];
    var nodes = body.querySelectorAll("tr");
    var stocks = [];
    nodes.forEach(function(e){
        var txt = e.querySelectorAll("td")[1].getElementsByTagName("input")[0].value;
        if(txt!='') stocks.push(txt);
    })
    chrome.storage.sync.set({ stocks });
    console.log(stocks);
}
Options.prototype.add = function(){
    var body = document.getElementById("stocks").getElementsByTagName("tbody")[0];
    console.log(body.querySelectorAll("tr"));
    var nodes = body.querySelectorAll("tr");
    var key = 1;
    if(nodes.length != 0){
        var last_node = nodes[nodes.length -1];
        key = last_node.dataset.index;
        key = key ? parseInt(key)+1 : 1;
    }
    
    var html = Options.row({key});
    body.appendChild(html);
    this.refreshNo();
}
Options.prototype.refreshNo = function(){
    let = no = 1;
    document.getElementById("stocks").getElementsByTagName("tbody")[0].querySelectorAll("tr").forEach(e=>{
        e.getElementsByTagName("td")[0].innerHTML = no;
        no++;
    })
}
Options.prototype.remove = function(el){
    el.closest("tr").remove();
    this.refreshNo();
}

new Options(document);