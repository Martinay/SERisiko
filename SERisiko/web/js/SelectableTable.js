// ---------------------- #

/**
 *
 * @author Alexander Santana Losada
 */

function SelectableTable(){
    //#Public Vars

    //#Private Vars
    var rows = 0;

    //# Public Methods
     this.getRows = function(){
        return rows;
    };

    this.addRow = function(tableId, data){
        rows++;
        var tb   = document.getElementById(tableId).getElementsByTagName('tbody')[0];
        var newTr = document.createElement('tr');
        // add name
            var td = document.createElement('td');
            td.appendChild(document.createTextNode(data.name));
            td.id = "cell_1"+rows+",1";    
            td.onclick = new Function("Core.setGame("+data.id+")");
            newTr.appendChild(td);
        // add id
            var td = document.createElement('td');
            td.appendChild(document.createTextNode(data.id));
            td.id = "cell_"+data.id+",2";    
            td.onclick = new Function("Core.setGame("+data.id+")");
            newTr.appendChild(td);
        // add players
            var td = document.createElement('td');
            td.appendChild(document.createTextNode(data.player+"/6"));
            td.id = "cell_"+rows+",3";    
            td.onclick = new Function("Core.setGame("+data.id+")");
            newTr.appendChild(td);    
        //#
        tb.appendChild(newTr);
    };

    this.deleteRow = function (tableId, rowID){
        document.getElementById(tableId).deleteRow(rowID);
        rows--;
    };
    
    this.clear = function(tableId){
        for(var i = 0; i < rows; i++)
            document.getElementById(tableId).deleteRow(1);
        rows = 0;
    };
    //# Private Methods
}