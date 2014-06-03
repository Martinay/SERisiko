// ---------------------- #

/**
 *
 * @author Alexander Santana Losada
 */

function SelectableTable(){
    //#Public Vars

    //#Private Vars
    var currentRow = -1;
    var rows = 0;

    //# Public Methods
    this.selectRow = function(newRow){
        if(newRow == currentRow)
            return;
        for(var i = 1; i < 5; ++i){
            var cell=document.getElementById('cell_'+newRow+','+i);
            if(cell != null)
                cell.style.background='#AAF';
            if(currentRow != -1){
                var cell=document.getElementById('cell_'+currentRow+','+i);
                if(cell != null)
                    cell.style.background='#C4D3F6';
            }
        }
        if(newRow == currentRow)
            currentRow = -1;
        else
            currentRow = newRow;
    };

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
            td.id = "cell_"+rows+",2";    
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

    this.isSelected = function(){
        return currentRow==-1?false:true;
    };

    this.clear = function(tableId){
        for(var i = 0; i < rows; i++)
            document.getElementById(tableId).deleteRow(1);
        rows = 0;
        currentRow = -1;
    };
    //# Private Methods
}