// ---------------------- #

/**
 *
 * @author Alexander Santana Losada
 */

var Core = new Core();

function Core() {
    //#Public Vars
    this.gameList = new GameList();
    this.sctTable = new SelectableTable();
    this.svgHandler = new SvgFunctions();
    
    //#Private Vars
    var thePlayerName = "";
    
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
    };

    this.setGame = function(id){
        if(this.sctTable != null){
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
    };

    this.createNewGame = function(){
        //check game settings....
        var gameName = document.getElementById("gameName").value;
        var maxPlayers = document.getElementById("maxPlayers").value;
        //parse data to server
        connection.createGame(gameName, maxPlayers);
        
        //wait for server response....
    };

    this.updateGameList = function(){
        if(this.sctTable != null){
            this.sctTable.clear("availableGames");
            getGameList();
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
        
        connection.leaveLobby();
        connection.joinGame(id);
    };
    var hideElement = function(element){
        element.style.display = "none";
    };
    var showElement = function(element){
        element.style.display = "block";
    };

    var getGameList = function(){
        
        // should be parsed by server...
        Core.gameList.clear();
        connection.listOpenGames();
    };
    
    var parseServerAnswers = function(elem){
        var message = JSON.parse(elem.data);
        
        switch(message.type){
            case "AddNewPlayerToLobbyMessage":
                if(message.state == 1){
                    // create Player on Client
                    hideElement(document.getElementById("setPlayerName"));
                    showElement(document.getElementById("selectGame"));
                    divs = document.getElementsByClassName('playerNameDisplay');
                    [].slice.call(divs).forEach(function(div){div.innerHTML = thePlayerName;});
                }
                else{
                    alert("Error: Bad response from Server");               
                }
                break;
            case "GameList":
                if(message.state == 1){
                    for(var i = 0; i < message.data.length; i++){
                        Core.sctTable.addRow("availableGames", message.data[i].ServerGame);
                        Core.gameList.addGame(message.data[i].ServerGame); 
                    }
                }
                else{
                    alert("Error: Bad response from Server");               
                }
                break;
            case "GameCreateMessage":
                 if(message.state == 1){
                    //verify 
                    hideElement(document.getElementById("newGame"));

                    Core.setGame(message.data.ServerGame.id);

                    //cleanup
                    document.getElementById("gameName").value = "Spielname";
                    document.getElementById("maxPlayers").value = "6";
                }
                else{
                    alert("Error: Bad response from Server");               
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
// ---------------------- #