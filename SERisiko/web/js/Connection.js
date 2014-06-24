
/*
 * 
 * author
 */
function Connection(){
    var connection = null;
    
    this.init = function(){
        if (connection != null)
            connection.close();
        connection = new RisikoApi();

        // Start ConnectionToServer
        connection.onmessage = function(elem) { //get message from server
            console.log( JSON.parse(elem.data) );
            Core.serverAnswerParserHandler.parseServerAnswers(elem);
            $('#serverAnswers').append("Serveranswer: " + elem.data + "<br>");
        };
    };
    this.init();
    
    this.joinServer = function(thePlayerName){
        connection.joinServer(thePlayerName);
    };
    
    this.joinLobby = function(){
        connection.joinLobby();
        if(Core.sctTable != null){
            Core.sctTable.clear("availableGames");
            Core.gameList.clear();
            Core.connectionHandler.listOpenGames();
        }
        else
            alert("Error! no gameTable");	
    };
    
    this.createGame = function(gameName, maxPlayers){
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

}


