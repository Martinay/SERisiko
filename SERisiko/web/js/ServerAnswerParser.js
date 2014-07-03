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
                case "PlayerLeftGameMessage":
                    handlePlayerLeftMessage(message);
                    break;
                case "PlayerCreatedMessage":
                    handlePlayerCreatedMessage(message);
                    break;
                case "GameStartedMessage":
                    handleGameStartedMessage(message);
                    break;
                case "EndFirstUnitPlacementMessage":
                    handleEndFirstUnitPlacementMessage(message);
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
            var player = new PlayerObject(message.data[i].Player.name, parseInt(message.data[i].Player.id), message.data[i].Player.ready);
            Core.playerList.addPlayer(player);
        }
        Core.updatePlayerList();
    };
    
    var handleReadyStateChangedMessage = function(message){
        //is it me?
        if(message.data[0].Player.id == Core.getPlayerId()){
            if(message.data[0].Player.ready == true){
                Core.changeButton("gamePhase", "Nicht Bereit", "", "alert('Test');" , false);
                root.getElementById("gameStatus").innerHTML = "Warte auf Weitere Mitspieler";
                if(root.getElementById("startGameBtn") != null){
                    root.getElementById("startGameBtn").disabled = false;
                }
            } else {
                root.getElementById("gameStatus").innerHTML = "Bitte melden Sie sich Spielbereit";
                Core.changeButton("gamePhase", "Bereit zum Spielen", "", "Core.connectionHandler.setPlayerState(true)", false);
                if(root.getElementById("startGameBtn") != null){
                    root.getElementById("startGameBtn").disabled = true;
                }
            }
            var player = new PlayerObject(message.data[0].Player.name, parseInt(message.data[0].Player.id), message.data[0].Player.ready);
            Core.playerList.updatePlayer(parseInt(message.data[0].Player.id), player);
            // cleanup
            root.getElementById("playerList").innerHTML = "";
            Core.updatePlayerList();
        }
        else{
            var player = new PlayerObject(message.data[0].Player.name, parseInt(message.data[0].Player.id), message.data[0].Player.ready);
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
        Core.changeButton("gamePhase", "Alle Einheiten Platziert", "", "Core.gameSteps.doFirstUnitPlacement();",  true);
        root.getElementById("backToLobbyBtn").disabled = false;
        Core.svgHandler.initUnitOnMap();
        for (var i = 0; i < message.data.length; i++){
            if(message.data[i].ServerGame){
                 Core.svgHandler.refreshOwnerRightsForUnitPlace(parseInt(message.data[i].ServerGame.numberOfUnitsToPlace));
            } else if(message.data[i].MapChange) {
                Core.svgHandler.setLandComplete(message.data[i].MapChange.countryId, message.data[i].MapChange.ownerId, message.data[i].MapChange.unitCount);
            }
        }
    };
    
    var handleEndFirstUnitPlacementMessage = function(message){
        for (var i = 0; i < message.data.length; i++){
            if(message.data[i].ServerGame){
               if(message.data[i].ServerGame.currentPlayerId == Core.getPlayerId()){
                   Core.setPlayerStatus(Core.gameSteps.state.UNITPLACEMENT);
                   Core.svgHandler.refreshOwnerRightsForUnitPlace(parseInt(message.data[i].ServerGame.numberOfUnitsToPlace));
                   document.getElementById("gameStatus").innerHTML = "Sie sind in Iherer Versorgungsphase:<br> Platzieren Sie ihre Einheiten";
               } else {
                   document.getElementById("gameStatus").innerHTML = "Spieler <div id='playerInAction'></div> ist an der Reihe";
                   document.getElementById("playerInAction").innerHTML = Core.playerList.getPlayerById(parseInt(message.data[i].ServerGame.currentPlayerId)).getPlayerName();
               }
            } else {
                if(message.data[i].MapChange){
                    if(Core.svgHandler.getLandUnitcount(message.data[i].MapChange.countryId, "_back") != message.data[i].MapChange.unitCount)
                        Core.svgHandler.setLandUnitcount(message.data[i].MapChange.countryId, message.data[i].MapChange.unitCount);
                }
            }
        }
        
        
    };
}