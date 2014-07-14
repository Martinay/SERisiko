
/*
 * 
 * author
 */
function Connection(){
    var connection = null;
    
    this.init = function(){
        if (connection !== null)
            connection.close();
        connection = new RisikoApi();

        // Start ConnectionToServer
        connection.onmessage = function(elem) { //get message from server
            $('#serverAnswers').append("Serveranswer: " + elem.data + "<br>");
            console.log(JSON.parse(elem.data));
            Core.serverAnswerParserHandler.parseServerAnswers(elem);
        };
    };
    this.init();
    
    this.joinServer = function(thePlayerName){
        connection.joinServer(thePlayerName);
    };
    
    this.joinLobby = function(){
        connection.joinLobby();
        if(Core.sctTable !== null){
            Core.sctTable.clear("availableGames");
            Core.gameList.clear();
            Core.connectionHandler.listOpenGames();
        }
        else
            alert("Error! no gameTable");	
    };
    
    this.createGame = function(gameName, maxPlayers){
        document.getElementById("gameNameAnzeige").innerHTML = gameName;
        connection.createGame(gameName, maxPlayers);
    };
    
    this.startGame = function(){
        connection.startGame();
    };
    
    this.leaveLobby = function(){
        connection.leaveLobby();
    };
    
    this.leaveGame = function(){
        connection.leaveGame();
    };
    
    this.joinGame = function(id){
        Core.setGameName(parseInt(id));
        connection.joinGame(parseInt(id));
    };
    
    this.setPlayerState = function(arg){
        connection.setPlayerState(arg);
    };
    
    this.listPlayers = function(){
        connection.listPlayers();
    };
    
    this.listOpenGames = function(){
        connection.listOpenGames();
    };
    
    this.sendAttack = function(attackerLandId, defenderLandId, amountAttackerUnits){
        connection.attack(attackerLandId, defenderLandId, amountAttackerUnits);
    };
    
    this.sendPlaceFirstUnits = function(PlaceUnitArray){
        Core.unitPlacementHandler.changefirstRound();
        connection.endFirstUnitPlacement(JSON.parse(PlaceUnitArray));
    };
    
    this.sendUnitMove = function(source, target, value){
        connection.move(source, target, value);
    };
    
    this.sendEndRound = function() {
        connection.endTurn();
    }; 
    
    this.sendEndAttack = function(){
        connection.endAttack();
    };
    
    this.sendUnitPlace = function(PlaceUnitArray){
        connection.unitPlacement(JSON.parse(PlaceUnitArray));
    };
    
    this.sendChatMessage = function(msg){
        connection.sendChatMessage(msg);
    };
}


