// ---------------------- #

/**
 *
 * @author Alexander Santana Losada
 */

function ServerAnswerParser(doc){
    //#Public Vars

    //#Private Vars
    var root = doc;
    
    //# Public Methods
    this.parseServerAnswers = function(elem){
        var message = JSON.parse(elem.data);
        if(message.state == 1){
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
                case "NewPlayerJoinedGameMessage":
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
                case "PlayerCreatedMessage":
                    handlePlayerCreatedMessage(message);
                    break;
                case "GameStartedMessage":
                    handleGameStartedMessage(message);
                    break;
                default:
                    //nothing
            } 
        }
        else{
            alert("Error: Bad response from Server");               
        }
    };
    
    //# Private Methods
    var handleAddNewPlayerToLobbyMessage = function(message){
        //is it me?
        if(message.data[0].Player.id == Core.getPlayerId()){
            // create Player on Client
            Core.hideElement(root.getElementById("setPlayerName"));
            Core.showElement(root.getElementById("selectGame"));
            var divs = root.getElementsByClassName('playerNameDisplay');
            [].slice.call(divs).forEach(function(div){div.innerHTML = Core.getPlayerName();});
        }
    };
    
    var handleGameListMessage = function(message){
        for(var i = 0; i < message.data.length; i++){
            Core.sctTable.addRow("availableGames", message.data[i].ServerGame);
            Core.gameList.addGame(message.data[i].ServerGame); 
        }
    };
    
    var handleGameCreatedMessage = function(message){
        //is it me? or am I not in an active game?
        if(message.data[1].Player.id == Core.getPlayerId() && !Core.isInGameLobby()){
        //verify 
            Core.hideElement(root.getElementById("newGame"));
            Core.prepareJoinedGame();

            root.getElementById("startGame").innerHTML = '<button  id="startGameBtn" name="startGameBtn" onClick="Core.connectionHandler.startGame();" style="width: 160px; margin-bottom: 10px;">Spielstarten</button>';
            root.getElementById("startGameBtn").disabled = true;
            //cleanup
            root.getElementById("maxPlayers").value = "6";
        }
        else{
            Core.sctTable.addRow("availableGames", message.data[0].ServerGame);
            Core.gameList.addGame(message.data[0].ServerGame); 
        }
        
    };
    
    var handleNewPlayerJoinedMessage = function(message){
        //is it me?
        if(message.data[0].Player.id == Core.getPlayerId()){
           Core.prepareJoinedGame();
        }
        else{
            var player = new PlayerObject(message.data[0].Player.name, parseInt(message.data[0].Player.id), message.data[0].Player.ready);
            Core.playerList.addPlayer(player);
            Core.updatePlayerList();
        }
    };
    
    var handlePlayerListMessage = function(message){
        // cleanup
        root.getElementById("playerList").innerHTML = "";
        Core.playerList.clear();
        // parse message			  	  
        for(var i = 0; i < message.data.length; i++){
            var player = new PlayerObject(message.data[i].Player.name, parseInt(message.data[i].Player.id), message.data[i].Player.ready, Core.playerList.getPlayerAmount());
            Core.playerList.addPlayer(player);
        }
        Core.updatePlayerList();
    };
    
    var handleReadyStateChangedMessage = function(message){
        //is it me?
        if(message.data[0].Player.id == Core.getPlayerId()){
            if(message.data[0].Player.ready == true){
                Core.svgHandler.refreshOwnerRightsForUnitPlace(5);
                root.getElementById("gameStatus").innerHTML = "Warte auf Weitere Mitspieler";
                root.getElementById("gamePhase").innerHTML = "Nicht Bereit";
                root.getElementById("gamePhase").onclick = function() { Core.connectionHandler.setPlayerState(false); };
                if(root.getElementById("startGameBtn") != null){
                    root.getElementById("startGameBtn").disabled = false;
                }
            } else {
                root.getElementById("gameStatus").innerHTML = "Bitte melden Sie sich Spielbereit";
                root.getElementById("gamePhase").innerHTML = "Bereit zum Spielen";
                root.getElementById("gamePhase").onclick = function() { Core.connectionHandler.setPlayerState(true); };
                if(root.getElementById("startGameBtn") != null){
                    root.getElementById("startGameBtn").disabled = true;
                }
            }
            var player = new PlayerObject(message.data[0].Player.name, parseInt(message.data[0].Player.id), message.data[0].Player.ready, Core.playerList.getPlayerAmount());
            Core.playerList.updatePlayer(parseInt(message.data[0].Player.id), player);
            // cleanup
            root.getElementById("playerList").innerHTML = "";
            Core.updatePlayerList();
        }
        else{
            var player = new PlayerObject(message.data[0].Player.name, parseInt(message.data[0].Player.id), message.data[0].Player.ready, Core.playerList.getPlayerAmount());
            Core.playerList.updatePlayer(parseInt(message.data[0].Player.id), player);   
            root.getElementById("playerList").innerHTML = "";
            Core.updatePlayerList(); 
        }
    };
    
    var handlePlayerLeftMessage = function(message){
        Core.playerList.deletePlayerById(parseInt(message.data[0].Player.id));
        Core.updatePlayerList();
    };
    
    var handlePlayerCreatedMessage = function(message){
        Core.setPlayerId(parseInt(message.data[0].Player.id));
        Core.connectionHandler.joinLobby();
    };
    
    var handleGameStartedMessage = function(message){
        Core.setGameRunning(true);
        Core.setPlayerStatus(Core.gameSteps.state.FIRSTUNITPLACEMENT);
        document.getElementById("gameStatus").innerHTML = "Sie sind in Iherer Platzierungsphase:<br> Platzieren Sie ihre Einheiten";
        root.getElementById("startGame").innerHTML = "";
        root.getElementById("gamePhase").innerHTML = "Alle Einheiten Platziert";
        root.getElementById("gamePhase").onclick = function() {Core.gameSteps.doFirstUnitPlacement();};
        root.getElementById("gamePhase").disabled = true;
        root.getElementById("backToLobbyBtn").disabled = false;
        Core.svgHandler.initUnitOnMap();
        //Core.svgHandler.refreshOwnerRightsForUnitPlace(message.data[0].ServerGame.numberOfUnitsToPlace);
        Core.svgHandler.refreshOwnerRightsForUnitPlace(5);
    };
}