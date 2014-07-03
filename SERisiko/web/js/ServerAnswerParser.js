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
                case "MapChangedMessage":
                    handleMapChangedMessage(message);
                    break;     
                case "AttackMessage":
                    handleAttackMessage(message);
                    break;
                case "AttackEndedMessage":
                    handleAttackEndedMessage(message);
                    break;
                case "EndTurnMessage":
                    handleEndTurnMessage(message);
                    break;
                case "EndUnitPlacementMessage":
                    handleEndUnitPlacementMessage(message);
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
        for (var i = 0; i < message.data.length; i++){
            if(message.data[i].MapChange){
                if(Core.svgHandler.getLandOwner(message.data[i].MapChange.countryId) == message.data[i].MapChange.ownerId){
                    Core.svgHandler.setLandUnitcount(message.data[i].MapChange.countryId, message.data[i].MapChange.unitCount);
                } else {
                    Core.svgHandler.setLandComplete(message.data[i].MapChange.countryId, message.data[i].MapChange.ownerId, message.data[i].MapChange.unitCount);

                }
            }
            if(message.data[i].Player){
                Core.playerList.deletePlayerById(parseInt(message.data[i].Player.id));
            }
        }
        Core.updatePlayerList();
    };
    
    var handlePlayerCreatedMessage = function(message){
         for (var i = 0; i < message.data.length; i++){
            if(message.data[i].ServerGame){
                 Core.svgHandler.refreshOwnerRightsForUnitPlace(parseInt(message.data[i].ServerGame.numberOfUnitsToPlace));
            } else if(message.data[i].MapChange) {
                Core.svgHandler.setLandComplete(message.data[i].MapChange.countryId, message.data[i].MapChange.ownerId, message.data[i].MapChange.unitCount);
            }
        }
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
                   Core.changeButton("gamePhase", "Alle Einheiten Platziert", "", "Core.gameSteps.doUnitPlacement();",  true);
                   document.getElementById("gameStatus").innerHTML = "Sie sind in Iherer Versorgungsphase:<br> Platzieren Sie ihre Einheiten";
                   Core.svgHandler.refreshOwnerRightsForUnitPlace(parseInt(message.data[i].ServerGame.numberOfUnitsToPlace));
               } else {
                   Core.setPlayerStatus(Core.gameSteps.state.IDLE);
                   document.getElementById("gameStatus").innerHTML = "Spieler " + Core.playerList.getPlayerById(parseInt(message.data[i].ServerGame.currentPlayerId)).getPlayerName() + " ist an der Reihe<br> Phase: Einheiten Setzen";
               }
            } else {
                if(message.data[i].MapChange){
                    if(Core.svgHandler.getLandUnitcount(message.data[i].MapChange.countryId) != message.data[i].MapChange.unitCount)
                        Core.svgHandler.setLandUnitcount(message.data[i].MapChange.countryId, message.data[i].MapChange.unitCount);
                }
            }
        } 
    };
    
    var handleMapChangedMessage = function(message){
        for (var i = 0; i < message.data.length; i++){
            if(message.data[i].MapChange){
                if(Core.svgHandler.getLandOwner(message.data[i].MapChange.countryId) == message.data[i].MapChange.ownerId){
                    Core.svgHandler.setLandUnitcount(message.data[i].MapChange.countryId, message.data[i].MapChange.unitCount);
                } else {
                    Core.svgHandler.setLandComplete(message.data[i].MapChange.countryId, message.data[i].MapChange.ownerId, message.data[i].MapChange.unitCount);

                }
            }
        } 
    };
    
    var handleAttackMessage = function(message){
        var defeat = false;
        var lands = new Array();
        var attackstate = true;
        var attackDiceCount = 1;
        var defeatDiceCount = 1;
        Core.combatHandler.deleteDices();
        
        for (var i = 0; i < message.data.length; i++){
            if(message.data[i].MapChange){
                lands[i] = Core.svgHandler.getLandUnitcount(message.data[i].MapChange.countryId);
                if(i == 1){
                    if(Core.svgHandler.getLandOwner(message.data[i].MapChange.countryId) == Core.getPlayerId()){
                        defeat = true;
                    }
                }
                if(Core.svgHandler.getLandOwner(message.data[i].MapChange.countryId) == message.data[i].MapChange.ownerId){
                    Core.svgHandler.setLandUnitcount(message.data[i].MapChange.countryId, message.data[i].MapChange.unitCount);
                } else {
                    Core.svgHandler.setLandComplete(message.data[i].MapChange.countryId, message.data[i].MapChange.ownerId, message.data[i].MapChange.unitCount);
                    attackstate = false;
                }
            }
            if(message.data[i].Dice){
                if(message.data[i].Dice.type == "Attacker"){
                    Core.combatHandler.setDice("A" + attackDiceCount, message.data[i].Dice.value);
                    attackDiceCount++;
                }
                if(message.data[i].Dice.type == "Defender"){
                    Core.combatHandler.setDice("D" + defeatDiceCount, message.data[i].Dice.value);
                    defeatDiceCount++;
                }
            }
        } 
        if(defeat == true){
            Core.combatHandler.showDefeat(lands[0], lands[1], attackstate);
        }
    };
    
    var handleAttackEndedMessage = function(message){
        if(message.data[0].ServerGame){
            if(message.data[0].ServerGame.currentPlayerId == Core.getPlayerId()){
                Core.setPlayerStatus(Core.gameSteps.state.UNITMOVEMENT);
                Core.changeButton("gamePhase", "Einheiten Verlegung Beenden", "", "Core.gameSteps.doUnitmovement();",  false);
                document.getElementById("gameStatus").innerHTML = "Sie sind in Iherer Verlegungsphase:<br> Verlegen Sie ihre Einheiten";
                Core.svgHandler.refreshOwnerRights(); 
            } else {
                Core.setPlayerStatus(Core.gameSteps.state.IDLE);
                document.getElementById("gameStatus").innerHTML = "Spieler " + Core.playerList.getPlayerById(parseInt(message.data[i].ServerGame.currentPlayerId)).getPlayerName() + " ist an der Reihe<br> Phase: Einheiten verlegen";
                Core.gameSteps.clearMap();
            }
        }
    };
    
    var handleEndUnitPlacementMessage = function(message){
        if(message.data[0].ServerGame){
            if(message.data[0].ServerGame.currentPlayerId == Core.getPlayerId()){
                Core.setPlayerStatus(Core.gameSteps.state.ATTACK);
                Core.changeButton("gamePhase", "Angriffphase Beenden", "", "Core.gameSteps.doAttackEnd();",  false);
                document.getElementById("gameStatus").innerHTML = "Sie sind in Iherer Angriffsphase:<br> Erobern Sie neue Länder";
                Core.svgHandler.refreshOwnerRights(); 
            } else {
                Core.setPlayerStatus(Core.gameSteps.state.IDLE);
                document.getElementById("gameStatus").innerHTML = "Spieler " + Core.playerList.getPlayerById(parseInt(message.data[i].ServerGame.currentPlayerId)).getPlayerName() + " ist an der Reihe<br> Phase: Länder Erobern";
                Core.gameSteps.clearMap();
            }
        }
    };
    
    var handleEndTurnMessage = function(message){
        if(message.data[0].ServerGame){
            if(message.data[0].ServerGame.currentPlayerId == Core.getPlayerId()){
                Core.setPlayerStatus(Core.gameSteps.state.UNITPLACEMENT);
                Core.svgHandler.refreshOwnerRightsForUnitPlace(parseInt(message.data[0].ServerGame.numberOfUnitsToPlace));
                document.getElementById("gameStatus").innerHTML = "Sie sind in Iherer Versorgungsphase:<br> Platzieren Sie ihre Einheiten";
                Core.changeButton("gamePhase", "Alle Einheiten Platziert", "", "Core.gameSteps.doUnitPlacement();",  false);
            } else {
                Core.setPlayerStatus(Core.gameSteps.state.IDLE);
                document.getElementById("gameStatus").innerHTML = "Spieler " + Core.playerList.getPlayerById(parseInt(message.data[i].ServerGame.currentPlayerId)).getPlayerName() + " ist an der Reihe<br> Phase: Einheiten setzen";
                Core.gameSteps.clearMap();
                Core.changeButton("gamePhase", "Nicht am Zug", "", "",  true);
            }
        }
    };
}