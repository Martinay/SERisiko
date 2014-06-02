// ---------------------- #

/**
 *
 * @author Alexander Santana Losada
 */

var Core = new Core();

function Core() {
    //#Public Vars
    this.gameList = new GameList();
    this.sctTable = new SelectableTable(this.gameList);
    this.svgHandler = new SvgFunctions();
    
    //#Private Vars
    var thePlayerName = "";
    var game = "stopped";
    //var gameListRefresher = $.timer(function(){Core.updateGameList();}, 2000);
    //var playerListRefresher = $.timer(function(){Core.updatePlayerList();}, 2000);
    
    //#InitConnection Function
    var connection = null;
    var etablishConnection = function(){
        if (connection != null)
            connection.close();
        connection = new RisikoApi();

        // Start ConnectionToServer
        connection.onmessage = function(elem) { //get message from server
            console.log( elem );
            parseServerAnswers(elem);
            $('#serverAnswers').append("Serveranswer: " + elem.data + "<br>");
        };
    };
    etablishConnection();
    //# Load Map... done by html object    
    
    
    //# Public Methods
    this.setPlayerName = function(){
        var name = document.getElementById("playerName").value;
        if(name == "" || name == "Ihr Spielername")
            return false;
        thePlayerName = name;

        // create Player on Server + joinLobby
        connection.joinServer(thePlayerName); // includes joinlobby
        //connection.joinLobby(thePlayerName);
        
        this.updateGameList();
        
        //wait for answer
        showElement(document.getElementById("loading_overlay"));
    };

    this.deletePlayerName = function(){
        if(thePlayerName == "")
            return false;

        connection.leaveLobby();
        thePlayerName = "";
        playerNameRegistered = false;
        document.getElementById("playerName").value = "Ihr Spielername";

        // revert menu
        showElement(document.getElementById("setPlayerName"));
        hideElement(document.getElementById("selectGame"));
        //gameListRefresher.pause();

        divs = document.getElementsByClassName('playerNameDisplay');
        [].slice.call(divs).forEach(function(div){div.innerHTML = playerName;});
        this.sctTable.clear("availableGames");
        
        etablishConnection();
    };

    this.leaveGame = function(){
        connection.leaveGame();
    }

    this.backToLobby = function(){
        //check response
        connection.joinLobby();
        
        showElement(document.getElementById("selectGame"));
        hideElement(document.getElementById("game"));
        hideElement(document.getElementById("GameScreen"));
        hideElement(document.getElementById("gameOptions"));
        hideElement(document.getElementById("newGame"));
        game = "stopped";
        //gameListRefresher.play();
        //playerListRefresher.pause();
    };

    this.setGame = function(id){
        if(this.sctTable != null){
            //alert("Joining to " + document.getElementById('cell_'+this.sctTable.getSelectedRow()+',1').innerHTML + " ...");
            //alert("Joining to " + document.getElementById('cell_'+id+',1').innerHTML + " ...");
            
            var svg = document.getElementsByTagName('object')[0].contentDocument.getElementsByTagName('svg')[0];
            this.svgHandler.init(svg);

            joinGame(this.sctTable, id);
            
            this.updatePlayerList();
        }
        else
            alert("Error! no gameTable");
    };

    this.showCreateNewGame = function(){
        showElement(document.getElementById("newGame"));
        hideElement(document.getElementById("selectGame"));
        //gameListRefresher.pause();
    };

    this.createNewGame = function(){
        //check game settings....
        var gameName = document.getElementById("gameName").value;
        var maxPlayers = document.getElementById("maxPlayers").value;
        var gameSettings = document.getElementById("gameSettings").value;
        //parse data to server
        connection.createGame();
        //verify 
        var idFromServer = 123;
        hideElement(document.getElementById("newGame"));
        document.getElementById("gameName").value = "Spielname";
        document.getElementById("maxPlayers").value = "6";
        document.getElementById("gameSettings").value = "Spieleinstellungen";
        
        this.setGame(idFromServer);
    };

    this.updateGameList = function(){
        if(this.sctTable != null){
            this.sctTable.clear("availableGames");
            getGameList(this.sctTable, this.gameList);
        }
        else
            alert("Error! no gameTable");	
    };

    this.minmax = function(value, min, max){
        if(parseInt(value) < min || isNaN(value)) 
            return min; 
        else if(parseInt(value) > max) 
            return max; 
        else return value;
    };

    this.checkForKey = function(caller, key){
        switch(caller){
            case "playerName":
                if(key == 13)
                    this.setPlayerName();
                break;
            default:
                    //nothing
        }
    };

    this.readyToPlay = function(){		
        // send to server : player ready
        // connection.setPlayerReady(); not yet implemented
        this.updatePlayerList();
    };

    this.updatePlayerList = function(){
        // get playerlsit from server // get ready state of pl from server
        connection.listPlayers();
        // parse message
        var players = [ // pseudo test data
                        {"name" : "Hans von Massow", "rdy" : 1},
                        {"name" : "Maismüller", "rdy" : 1},
                        {"name" : "Karl-Heinz", "rdy" : 0},
                        {"name" : "Philipp", "rdy" : 1},
                        {"name" : "Alex", "rdy" : 0},
                        {"name" : "Nerv", "rdy" : 1}
                        ];			  	  
        var rdy = '<img id="Ready" src="img/ready.png" width="15" align="right"/>';
        var notRdy = '<img id="NoReady" src="img/not_ready.png" width="15" align="right"/>';

        document.getElementById("PlayerList").innerHTML = "";
        for(var i = 0; i < 6; i++){
            $("#PlayerList").append(players[i].name + ((players[i].rdy == 1)? rdy : notRdy) + "<br>");
        }
    };
    
    this.clearServerAnswers = function(){
        document.getElementById("serverAnswers").innerHTML = "";
    };
    
    //# Private Methods    
    var joinGame = function(table, id){
        showElement(document.getElementById("game"));
        showElement(document.getElementById("GameScreen"));
        showElement(document.getElementById("gameOptions"));
        hideElement(document.getElementById("selectGame"));
        //gameListRefresher.pause();
        game = "running";
        table.selectRow(0);
        
        //playerListRefresher.play();
        
        connection.leaveLobby();
        connection.joinGame(id);
    };
    var hideElement = function(element){
        element.style.display = "none";
    };
    var showElement = function(element){
        element.style.display = "block";
    };

    var getGameList = function(table, list){
        // get gameslist from server
        connection.listOpenGames();
        
        list.addGame(["Game 1", "DHBW", "1/6", "n/a"], table);
        list.addGame(["Game 42", "World", "0/6", "n/a"], table);
        list.addGame(["Game 3", "DHBW", "4/6", "n/a"], table);
    };
    
    var parseServerAnswers = function(elem){
        var message = JSON.parse(elem.data);
        
        switch(message.type){
            case "AddNewPlayerToLobbyMessage":
                if(message.state == 1){
                    hideElement(document.getElementById("loading_overlay"));      

                    // create Player on Client
                    hideElement(document.getElementById("setPlayerName"));
                    showElement(document.getElementById("selectGame"));
                    divs = document.getElementsByClassName('playerNameDisplay');
                    [].slice.call(divs).forEach(function(div){div.innerHTML = thePlayerName;});

                    //gameListRefresher.play();
                }
                else{
                    alert("Error: Bad response from Server");
                    hideElement(document.getElementById("loading_overlay"));                    
                }
                break;
            default:
                //nothing
        }  
    };
    var sleep = function(milliseconds) {
      var start = new Date().getTime();
      for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds){
          break;
        }
      }
    };
}

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

    this.addGame = function(data, table){
        table.addRow("availableGames", data);
        amount++;
        games.push(parseData(data));
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

    //# Private Methods
    var parseData = function(data){
        var game = new GameObject(data[0], data[1], data[2], data[3]);
        return game;
    };
}

function GameObject(name, number, mp, maxP, set){
    //#Public Vars

    //#Private Vars
    var gameName = name;
    var gameId = number;
    var map = mp;
    var maxPlayers = maxP;
    var settings = set;

    //# Public Methods
    this.getGameName = function(){
        return gameName;
    };
    this.getMaxPlayers = function(){
        return maxPlayers;
    };
    this.getSettings = function(){
        return settings;
    };
    this.getMap = function(){
        return map;
    };
    this.getGameId = function(){
        return gameId;
    }
    //# Private Methods
}
// ---------------------- #