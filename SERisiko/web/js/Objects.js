// ---------------------- #

/**
 *
 * @author Alexander Santana Losada
 */


function GameList(){
    //#Public Vars

    //#Private Vars
    var amount = 0;
    var games = new Array();

    //# Public Methods
    this.clear = function(){
        games = [];
        amount = 0;
    };

    this.addGame = function(data){
        amount++;
        games.push(new GameObject(data.name, data.id, data.playerCount, data.maxPlayer));
    };

    this.getGames = function(){
        if(games !== null)
            return games;
        else
            alert('no games found');
    };

    this.getGameAmount = function(){
        return amount;
    };

    this.getGame = function(index){
        return games[index];
    };
    
    this.getGameNameById = function(id){
        for(var i = 0; i < amount; i++){
            if(games[i].getGameId() === id){
                return games[i].getGameName();
            }
        }
    };
    
    this.deleteGame = function(index){
        if(index < amount){
            for(var i = 0; i < amount; i++){
                if(games[i].getGameId() === index){
                    games.splice(index, 1);
                }
            }
        }
    };

    //# Private Methods
}

function GameObject(name, id, actualP, maxP){
    //#Public Vars

    //#Private Vars
    var gameName = name;
    var gameId = parseInt(id);
    var actualPlayers = parseInt(actualP);
    var maxPlayers = parseInt(maxP);

    //# Public Methods
    this.getGameName = function(){
        return gameName;
    };
     this.actualPlayers = function(){
        return actualPlayers;
    };
    this.getMaxPlayers = function(){
        return maxPlayers;
    };
    this.getGameId = function(){
        return gameId;
    };
    //# Private Methods
}


function PlayerList(){
    //#Public Vars

    //#Private Vars
    var amount = 0;
    var players = new Array();

    //# Public Methods
    this.clear = function(){
        players = new Array();
        amount = 0;
    };

    this.addPlayer = function(player){
        amount++;
        players.push(player);
    };

    this.getPlayers = function(){
        if(players !== null)
            return players;
        else
            alert('no players found');
    };

    this.getPlayerAmount = function(){
        return amount;
    };

    this.getPlayer = function(index){
        return players[index];
    };
    
    this.getPlayerById = function(id){
       for(var i = 0; i < amount; i++){
            if(players[i].getPlayerId() === id){
                return players[i];
            }
        }
        return new PlayerObject("Player not found", -1, false);
    };

    this.deletePlayerById = function(id){
        for(var i = 0; i < amount; i++){
            if(players[i].getPlayerId() === id){
                players.splice(i, 1);
                amount--;
            }
        }
    };
    
    this.updatePlayer = function(id, player){
       this.deletePlayerById(id);
       this.addPlayer(player);
    };
    //# Private Methods
}

function PlayerObject(name, id, state, rdyState){
    //#Public Vars
    
    //#Private Vars
    var playerName = name;
    var playerId = id;
    var playerStatus = state;
    var readyState = rdyState;
    
    //# Public Methods
    this.getPlayerName = function(){
        return playerName;
    };
    
    this.getReadyState = function(){
        return readyState;
    };
    
    this.getPlayerStatus = function(){
        return playerStatus;
    };
    
    this.getPlayerId = function(){
        return playerId;
    };
    //# Private Methods
}


/*
 * Data abstraction class for the own data of the player
 */
function MyDataObject(){
    
    //#Private Vars
    var thePlayerId = -1;
    var thePlayerName = "";
    var inGameLobby = false;
    var gameId = -1;
    
     //# Public Methods
    this.getPlayerId = function(){
        return thePlayerId;
    };
    
    this.getPlayerName = function(){
        return thePlayerName;
    };
  
    this.isInGameLobby = function(){
        return inGameLobby;
    };
    
    this.getGameId = function(){
        return gameId;
    };
    
    this.setPlayerId = function(id){
        thePlayerId = id;
    };
    
    this.setPlayerName = function(name){
        thePlayerName = name;
    };
    
    this.setInGameLobby = function(arg){
        inGameLobby = arg;
    };
    
    this.setGameId = function(id){
        gameId = id;
    };    
}