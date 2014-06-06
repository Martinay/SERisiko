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
            case "NewPlayerJoinedMessage":
                handleNewPlayerJoinedMessage(message);
                break;
            case "PlayerList":
                handlePlayerListMessage(message);
                break;
            case "ReadyStateChangedMessage":
                handleReadyStateChangedMessage(message);
                break;
            case "PlayerLeftMessage":
                handlePlayerLeftMessage(message);
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
    
    var handleNewPlayerJoinedMessage = function(message){
        Core.showElement(root.getElementById("game"));
        Core.hideElement(root.getElementById("selectGame"));
        
        // give me some lands test
            Core.svgHandler.setNewLandOwner("D2" , Core.getPlayerName());
            Core.svgHandler.setNewLandOwner("D6" ,Core.getPlayerName());
            Core.svgHandler.setNewLandOwner("E1" ,Core.getPlayerName());
            Core.svgHandler.setNewLandOwner("E3" ,Core.getPlayerName());
            Core.svgHandler.setNewLandOwner("C4" ,Core.getPlayerName());
            Core.svgHandler.setNewLandOwner("B5" ,Core.getPlayerName());
            Core.svgHandler.setNewLandOwner("A1" ,Core.getPlayerName());
            Core.svgHandler.setNewLandOwner("A5" ,Core.getPlayerName());
            Core.svgHandler.setNewLandOwner("P4" ,Core.getPlayerName());
            Core.svgHandler.setNewLandOwner("P12" ,Core.getPlayerName());
            
            Core.svgHandler.refreshOwnerRights();
        //#
        
        Core.listPlayers();
    };
    
    var handlePlayerListMessage = function(message){
        var rdy = '<img id="Ready" src="img/ready.png" width="15" align="right"/>';
        var notRdy = '<img id="NoReady" src="img/not_ready.png" width="15" align="right"/>';
        
        // cleanup   && later maybe just changes??=????
        root.getElementById("playerList").innerHTML = "";
        Core.playerList.clear();
        
        // parse message			  	  
        if(message.state == 1){
            for(var i = 0; i < message.data.length; i++){
                $("#playerList").append(message.data[i].Player.name + ((message.data[i].Player.ready == 1)? rdy : notRdy) + "<br>"); 
                Core.playerList.addPlayer(message.data[i].Player.name, message.data[i].Player.id, message.data[i].Player.ready);
            }
        }
        else{
            alert("Error: Bad response from Server");               
        }  
    };
    
    var handleReadyStateChangedMessage = function(message){
        if(message.state == 1){
            Core.listPlayers();
        }
        else{
            alert("Error: Bad response from Server");               
        } 
    };
    
    var handlePlayerLeftMessage = function(message){
        if(message.state == 1){
            Core.playerList.deletePlayerById(message.data[0].Player.id);
            Core.listPlayers();
        }
        else{
            alert("Error: Bad response from Server");               
        }
    };
}