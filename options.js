class Options{
    constructor(){
        this.addEventListener()
    }
}
Options.prototype.addEventListener = function(){
    var _this = this;
    document.getElementById("add").addEventListener("click",function(){
        _this.add();
    })
    
    document.getElementById("stocks").getElementsByTagName("tbody")[0].addEventListener('click',function(e){
        if(e.target.tagName == 'BUTTON'){
            //do something
            _this.remove(e.target);
        }
    })
}
Options.prototype.add = function(){
    var body = document.getElementById("stocks").getElementsByTagName("tbody")[0];
    var key = body.querySelectorAll("tr").slice(-1).dataset.index;
    key = key ? key+1 : 1;
    var html = this.row({key});
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
Options.prototype.row = function(data){
    var key = data.key ? data.key : 1;
    var tr = document.createElement("tr");
    tr.dataset.index = key;
    tr.innerHTML = `<td>${ key }</td>
    <td><input type="text" name="stock[${key}][name]"></td>
    <td><input type="radio" name="stock[${key}][server]" checked value=1 ></td>
    <td><input type="radio" name="stock[${key}][server]" value=2 ></td>
    <td><input type="radio" name="stock[${key}][server]" value=3 ></td>
    <td><button data-btn="remove${key}" title="remove row">x</button></td>`;
    return tr;

}
new Options(document);