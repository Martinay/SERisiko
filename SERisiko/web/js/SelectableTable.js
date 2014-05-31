// ---------------------- #

/**
 *
 * @author Alexander Santana Losada
 */

function SelectableTable(list){
    //#Public Vars

    //#Private Vars
    var currentRow = -1;
    var rows = 0;
    var gameList = list;

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

    this.getSelectedRow = function(){
        return currentRow;
    };

    this.getRows = function(){
        return rows;
    };

    this.addRow = function(tableId, cells){
        rows++;
        var tb   = document.getElementById(tableId)
                                                .getElementsByTagName('tbody')[0];
        var newTr = document.createElement('tr');
        for (var i = 0; i < cells.length; i++) {
            var td = document.createElement('td');
            td.appendChild(document.createTextNode(cells[i]));
            td.id = "cell_"+rows+","+(parseInt(i)+1);
            //td.onclick = new Function("Core.sctTable.selectRow('"+rows+"')");
            //td.ondblclick = new Function("Core.setGame()");
            
            // parse game id form server list
            
            td.onclick = new Function("Core.setGame("+rows+")");
            newTr.appendChild(td);
        }
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
        gameList.clear();
    };
    //# Private Methods
}