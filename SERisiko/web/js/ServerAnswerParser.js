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
                case "PlayerCreatedMessage":
                    handlePlayerCreatedMessage(message);
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
        //is it me?
        if(message.data[1].Player.id == Core.getPlayerId()){
        //verify 
            Core.hideElement(root.getElementById("newGame"));

            Core.setGame(parseInt(message.data[0].ServerGame.id));

            //cleanup
            root.getElementById("gameName").value = "Spielname";
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
            // cleanup
            root.getElementById("playerList").innerHTML = "";
            Core.playerList.clear();
            Core.listPlayers();
            //verify 
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
            
            var player = new PlayerObject(message.data[0].Player.name, parseInt(message.data[0].Player.id), message.data[0].Player.ready);
            Core.playerList.addPlayer(player);
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
                root.getElementById("optionsInGame").innerHTML = "Nicht Bereit";
                root.getElementById("optionsInGame").onclick = function() { Core.readyToPlay(false); };
            } else {
                root.getElementById("optionsInGame").innerHTML = "Bereit zum Spielen";
                root.getElementById("optionsInGame").onclick = function() { Core.readyToPlay(true); };
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
        Core.joinLobby();
    };
}