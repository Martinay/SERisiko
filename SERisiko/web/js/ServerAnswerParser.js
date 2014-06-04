// ---------------------- #

/**
 *
 * @author Alexander Santana Losada
 */

function ServerAnswerParser(doc){
    //#Public Vars
    //
    //#Private Vars
    var root = doc;
    
    //# Public Methods
    this.parseServerAnswers = function(elem){
        var message = JSON.parse(elem.data);
        
        switch(message.type){
            case "AddNewPlayerToLobbyMessage":
                handleAddNewPlayerToLobbyMessage(message);
                break;
            case "GameList":
                handleGameListMessage(message);
                break;
            case "GameCreatedMessage":
                handleGameCreatedMessage(message);
                break;
            default:
                //nothing
        }  
    };
    
    //# Private Methods
    var handleAddNewPlayerToLobbyMessage = function(message){
         if(message.state == 1){
            // create Player on Client
            Core.hideElement(root.getElementById("setPlayerName"));
            Core.showElement(root.getElementById("selectGame"));
            var divs = root.getElementsByClassName('playerNameDisplay');
            [].slice.call(divs).forEach(function(div){div.innerHTML = Core.getPlayerName();});
        }
        else{
            alert("Error: Bad response from Server");               
        }
    };
    var handleGameListMessage = function(message){
        if(message.state == 1){
            for(var i = 0; i < message.data.length; i++){
                Core.sctTable.addRow("availableGames", message.data[i].ServerGame);
                Core.gameList.addGame(message.data[i].ServerGame); 
            }
        }
        else{
            alert("Error: Bad response from Server");               
        }
    };
    var handleGameCreatedMessage = function(message){
        if(message.state == 1){
            //verify 
            Core.hideElement(root.getElementById("newGame"));

            Core.setGame(message.data[0].ServerGame.id);

            //cleanup
            root.getElementById("gameName").value = "Spielname";
            root.getElementById("maxPlayers").value = "6";
        }
        else{
            alert("Error: Bad response from Server");               
        }
    };
    
}