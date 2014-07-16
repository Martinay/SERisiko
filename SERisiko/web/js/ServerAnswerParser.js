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
        if(message.state === 1){
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
                    handlePlayerLeftGameMessage(message);
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
                case "ChatMessage":
                    handleChatMessage(message);
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
        if(message.data[0].Player.id === Core.getPlayerId()){
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
        if(message.data[1].Player.id === Core.getPlayerId() && !Core.isInGameLobby()){
        //verify 
            Core.hideElement(root.getElementById("newGame"));
            Core.showElement(root.getElementById("game"));
            
            setTimeout(function () {Core.prepareJoinedGame(message.data[0].ServerGame.id);}, 100);

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
        if(message.data[0].Player.id === Core.getPlayerId() && message.data[1].ServerGame !== undefined){
            Core.showElement(root.getElementById("game"));
            
            setTimeout(function () {Core.prepareJoinedGame(message.data[1].ServerGame.id);},    100);
        }
        else if(Core.isInGameLobby()){
            var player = new PlayerObject(message.data[0].Player.name, parseInt(message.data[0].Player.id), message.data[0].Player.playerStatus, message.data[0].Player.ready);
            Core.playerList.addPlayer(player);
            Core.updatePlayerList();
        }
        else{
            Core.clearOpenGames();
            Core.connectionHandler.listOpenGames();
        }
    };
    
    var handlePlayerListMessage = function(message){
        // cleanup
        root.getElementById("playerList").innerHTML = "";
        Core.playerList.clear();
        // parse message			  	  
        for(var i = 0; i < message.data.length; i++){
            if(message.data[i].Player){
                var player = new PlayerObject(message.data[i].Player.name, parseInt(message.data[i].Player.id), message.data[i].Player.playerStatus, message.data[i].Player.ready);
                Core.playerList.addPlayer(player);
            }
            if(message.data[i].ServerGame){
                Core.updatePlayerList();
                if(message.data[i].ServerGame.currentGameStatus !== "WaitingForPlayer"){
                    Core.changePlayerListPic(parseInt(message.data[i].ServerGame.currentPlayerId));
                }
            }
        }
    };
    
    var handleReadyStateChangedMessage = function(message){
        if(message.data[0].Player.id === Core.getPlayerId()){
            if(message.data[0].Player.ready === true){
                Core.changeButton("gamePhase", "Nicht Bereit", "", "Core.connectionHandler.setPlayerState(false);" , false);
                root.getElementById("gameStatus").innerHTML = "Warte auf Weitere Mitspieler";
                if(root.getElementById("startGameBtn") != null){
                    root.getElementById("startGameBtn").disabled = false;
                }
            } else {
                root.getElementById("gameStatus").innerHTML = "<span style='color: red;'>Bitte melden Sie sich Spielbereit</span>";
                Core.changeButton("gamePhase", "Bereit zum Spielen", "", "Core.connectionHandler.setPlayerState(true)", false);
                if(root.getElementById("startGameBtn") !== null){
                    root.getElementById("startGameBtn").disabled = true;
                }
            }
            var player = new PlayerObject(message.data[0].Player.name, parseInt(message.data[0].Player.id), message.data[0].Player.playerStatus, message.data[0].Player.ready);
            Core.playerList.updatePlayer(parseInt(message.data[0].Player.id), player);
            // cleanup
            root.getElementById("playerList").innerHTML = "";
            Core.updatePlayerList();
        }
        else{
            var player = new PlayerObject(message.data[0].Player.name, parseInt(message.data[0].Player.id), message.data[0].Player.playerStatus, message.data[0].Player.ready);
            Core.playerList.updatePlayer(parseInt(message.data[0].Player.id), player);   
            root.getElementById("playerList").innerHTML = "";
            Core.updatePlayerList(); 
        }
    };
    
    var handlePlayerLeftGameMessage = function(message){
        var gameStatusFinished = false;
        if(!Core.isInGameLobby() && message.data[0].Player !== undefined && message.data[0].Player.id !== Core.getPlayerId()){
            Core.clearOpenGames();
            Core.connectionHandler.listOpenGames();
        }
        else{    
            for (var i = 0; i < message.data.length; i++){
                if(message.data[i].MapChange){
                    if(Core.svgHandler.getLandOwner(message.data[i].MapChange.countryId) === message.data[i].MapChange.ownerId){
                        Core.mapAnimationHandler.prepareUnitAddRemove(message.data[i].MapChange.countryId, message.data[i].MapChange.unitCount);
                    } else {
                        Core.mapAnimationHandler.prepareUnitAddRemove("", message.data[i].MapChange.countryId, message.data[i].MapChange.unitCount, message.data[i].MapChange.ownerId);
                    }
                }
                if(message.data[i].Player){
                    Core.playerList.deletePlayerById(parseInt(message.data[i].Player.id));
                    var playerId = message.data[i].Player.id;
                    if(message.data[i].Player.id === Core.getPlayerId()){
                        Core.connectionHandler.joinLobby();
                    }
                }
                if(message.data[i].ServerGame){
                    if(message.data[i].ServerGame.currentGameStatus === "Finished"){
                        gameStatusFinished = true;
                    } else {
                        Core.updatePlayerList();
                    }
                }
            }
        }
        if(gameStatusFinished && playerId !== Core.getPlayerId()){
            Core.connectionHandler.joinLobby();
            Core.clearDisplayBackToLobby();
        }
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
        if(message.data[0].ServerGame && message.data[0].ServerGame.currentGameStatus === "WaitingForPlayer"){
            root.getElementById("gameStatus").innerHTML = "Warte auf Weitere Mitspieler<br> <span style='color: red;'>Nicht alle Spieler sind bereit!</span>";
            return;
        }
        var korrektBroadcaster = false;
        if(message.data[message.data.length-1].ServerGame && Core.getGameId() == message.data[message.data.length-1].ServerGame.id)
            korrektBroadcaster = true;
        else if(message.data[message.data.length-1].ServerGame && message.data[message.data.length-1].ServerGame.currentPlayerId == Core.getPlayerId()){
            korrektBroadcaster = true;
            Core.setGameId(message.data[message.data.length-1].ServerGame.id);
        }
        if(Core.isInGameLobby() && korrektBroadcaster){
            Core.setGameRunning(true);
            root.getElementById("gameStatus").innerHTML = "Sie sind in Iherer Platzierungsphase:<br> <span style='color: red;'>Platzieren Sie ihre Einheiten</span>";
            root.getElementById("startGame").innerHTML = "";
            Core.changeButton("gamePhase", "Alle Einheiten Platziert", "", "Core.gameSteps.doFirstUnitPlacement();",  true);
            root.getElementById("backToLobbyBtn").disabled = false;
            Core.svgHandler.initUnitOnMap();
            Core.gameSteps.setGameStep(Core.gameSteps.state.FIRSTUNITPLACEMENT);
            for (var i = 0; i < message.data.length; i++){
                if(message.data[i].ServerGame){
                    Core.gameSteps.handleCurrentGameStatus(message.data[i].ServerGame.currentGameStatus, message.data[i].ServerGame.numberOfUnitsToPlace, "");
                } else if(message.data[i].MapChange) {
                    Core.svgHandler.setLandComplete(message.data[i].MapChange.countryId, message.data[i].MapChange.ownerId, message.data[i].MapChange.unitCount);
                    Core.svgHandler.changeLandVisible(message.data[i].MapChange.countryId);
                }
            }
            Core.updatePlayerList();
            Core.changePlayerListPic(0);
        }
        else{
            Core.clearOpenGames();
            Core.connectionHandler.listOpenGames();
        }
    };
    
    var handleEndFirstUnitPlacementMessage = function(message){
        for (var i = 0; i < message.data.length; i++){
            if(message.data[i].ServerGame){
                if(message.data[i].ServerGame.currentPlayerId === Core.getPlayerId()){
                   Core.gameSteps.handleCurrentGameStatus(message.data[i].ServerGame.currentGameStatus, message.data[i].ServerGame.numberOfUnitsToPlace, "");
                } else {
                   Core.gameSteps.handleCurrentGameStatus("Idle", message.data[i].ServerGame.currentPlayerId, "Einheiten Setzen");
                }
               Core.changePlayerListPic(message.data[i].ServerGame.currentPlayerId);
            } 
            if(message.data[i].MapChange){
                if(Core.svgHandler.getLandUnitcount(message.data[i].MapChange.countryId) !== message.data[i].MapChange.unitCount)
                    Core.mapAnimationHandler.prepareUnitAddRemove(message.data[i].MapChange.countryId, message.data[i].MapChange.unitCount);
            }
            if(message.data[i].Player){
                root.getElementById(String(message.data[i].Player.id)).setAttribute("src", "img/ready.png");
            }
        }
    };
    
    var handleMapChangedMessage = function(message){
        if(message.data.length === 3 && message.data[2].ServerGame.currentGameStatus === "Move"){
            Core.mapAnimationHandler.doMovementAnimation(message.data[0].MapChange.countryId, message.data[1].MapChange.countryId, parseInt(message.data[1].MapChange.unitCount) - parseInt(message.data[0].MapChange.unitCount));

            Core.svgHandler.setLandUnitcount(message.data[0].MapChange.countryId, message.data[0].MapChange.unitCount);
            Core.svgHandler.changeLandVisible(message.data[0].MapChange.countryId); 
            Core.svgHandler.setLandUnitcount(message.data[1].MapChange.countryId, message.data[1].MapChange.unitCount); 
            Core.svgHandler.changeLandVisible(message.data[1].MapChange.countryId); 
        }   
        else{
            for (var i = 0; i < message.data.length; i++){
                if(message.data[i].MapChange){
                    if(Core.svgHandler.getLandOwner(message.data[i].MapChange.countryId) === message.data[i].MapChange.ownerId){
                        Core.svgHandler.setLandUnitcount(message.data[i].MapChange.countryId, message.data[i].MapChange.unitCount);
                        Core.svgHandler.changeLandVisible(message.data[i].MapChange.countryId);
                    } else {
                        Core.svgHandler.setLandComplete(message.data[i].MapChange.countryId, message.data[i].MapChange.ownerId, message.data[i].MapChange.unitCount);
                        Core.svgHandler.changeLandVisible(message.data[i].MapChange.countryId);
                    }
                }
            } 
        }
    };
    
    var handleAttackMessage = function(message){
        Core.combatHandler.showCombat(message);
    };
    
    var handleAttackEndedMessage = function(message){
        for (var i = 0; i < message.data.length; i++){
            if(message.data[i].ServerGame ){
                if(message.data[i].ServerGame.currentPlayerId === Core.getPlayerId()){
                    Core.gameSteps.handleCurrentGameStatus(message.data[i].ServerGame.currentGameStatus, 0, "");
                } else {
                    Core.connectionHandler.listPlayers();
                    Core.gameSteps.handleCurrentGameStatus("Idle", message.data[i].ServerGame.currentPlayerId, "Einheiten verlegen</span>");
                }
                Core.changePlayerListPic(message.data[i].ServerGame.currentPlayerId);
            }
        }
    };
    
    var handleEndUnitPlacementMessage = function(message){
        for (var i = 0; i < message.data.length; i++){
            if(message.data[i].ServerGame){
                if(message.data[i].ServerGame.currentPlayerId === Core.getPlayerId()){
                    Core.gameSteps.handleCurrentGameStatus(message.data[i].ServerGame.currentGameStatus, 0, "");
                } else {
                    Core.gameSteps.handleCurrentGameStatus("Idle", message.data[i].ServerGame.currentPlayerId, "Länder Erobern");
                }
            }
            if(message.data[i].MapChange){
                if(message.data[i].MapChange.ownerId !== Core.getPlayerId()){
                    Core.mapAnimationHandler.prepareUnitAddRemove(message.data[i].MapChange.countryId, message.data[i].MapChange.unitCount);
                }
            }
        }
    };
    
    var handleEndTurnMessage = function(message){
        for (var i = 0; i < message.data.length; i++){
            if(message.data[i].ServerGame){
                if(message.data[i].ServerGame.currentPlayerId === Core.getPlayerId()){
                    Core.gameSteps.handleCurrentGameStatus(message.data[i].ServerGame.currentGameStatus, message.data[i].ServerGame.numberOfUnitsToPlace, "");
                } else {
                    Core.gameSteps.handleCurrentGameStatus("Idle", message.data[i].ServerGame.currentPlayerId, "Einheiten setzen");
                }
                Core.changePlayerListPic(message.data[i].ServerGame.currentPlayerId);
            }
        }
    };
    
    var handleChatMessage = function(message){
        var d = new Date();
        var n = d.toLocaleTimeString(); 

        message = "("+n+") <b>"+Core.playerList.getPlayerById(message.data[0].ChatMessage.player).getPlayerName()+"</b>: " + message.data[0].ChatMessage.message + "<br>";
        
        root.getElementById("chatbox").innerHTML = root.getElementById("chatbox").innerHTML + message;
        root.getElementById("chatbox").scrollTop = root.getElementById("chatbox").scrollHeight;
    };
}
