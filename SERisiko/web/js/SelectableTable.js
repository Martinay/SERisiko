// ---------------------- #

/**
 *
 * @author Alexander Santana Losada
 */

function SelectableTable(doc){
    //#Public Vars

    //#Private Vars
    var rows = 0;
    var root = doc;

    //# Public Methods
     this.getRows = function(){
        return rows;
    };

    this.addRow = function(tableId, data){
        rows++;
        var tb   = root.getElementById(tableId).getElementsByTagName('tbody')[0];
        var newTr = root.createElement('tr');
        // add name
            var td = root.createElement('td');
            td.appendChild(root.createTextNode(data.name));
            td.id = "cell_"+rows+",1";    
            td.onclick = new Function("Core.setGame("+data.id+")");
            newTr.appendChild(td);
        // add id
            var td = root.createElement('td');
            td.appendChild(root.createTextNode(data.id));
            td.id = "cell_"+rows+",2";    
            td.onclick = new Function("Core.setGame("+data.id+")");
            newTr.appendChild(td);
        // add players
            var td = root.createElement('td');
            td.appendChild(root.createTextNode(data.playerCount+"/"+data.maxPlayer));
            td.id = "cell_"+rows+",3";    
            td.onclick = new Function("Core.setGame("+data.id+")");
            newTr.appendChild(td);    
        //#
        tb.appendChild(newTr);
    };

    this.deleteRow = function (tableId, rowID){
        root.getElementById(tableId).deleteRow(rowID);
        rows--;
    };
    
    this.clear = function(tableId){
        for(var i = 0; i < rows; i++)
            root.getElementById(tableId).deleteRow(1);
        rows = 0;
    };
    //# Private Methods
}