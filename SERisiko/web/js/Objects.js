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
        if(games != null)
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
    this.deleteGame = function(index){
        if(index < amount){
            for(var i = 0; i < amount; i++){
                if(games[i].getGameId() == index){
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
    var gameId = id;
    var actualPlayers = actualP;
    var maxPlayers = maxP;

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
    }
    //# Private Methods
}


function PlayerList(){
    //#Public Vars

    //#Private Vars
    var amount = 0;
    var players = new Array();

    //# Public Methods
    this.clear = function(){
        players = [];
        amount = 0;
    };

    this.addPlayer = function(data){
        amount++;
        players.push(new PlayerObject(data.name, data.id, data.ready));
    };

    this.getPlayers = function(){
        if(players != null)
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

    this.deletePlayerById = function(id){
        for(var i = 0; i < amount; i++){
            if(players[i].getPlayerId() == id){
                players.splice(i, 1);
            }
        }
    };

    //# Private Methods
}

function PlayerObject(name, id, rdy){
    //#Public Vars

    //#Private Vars
    var playerName = name;
    var playerId = id;
    var readyState = rdy;

    //# Public Methods
    this.getPLayerName = function(){
        return playerName;
    };
     this.getReadyState = function(){
        return readyState;
    };
    this.getPlayerId = function(){
        return playerId;
    }
    //# Private Methods
}