// ---------------------- #

/**
 *
 * @author Alexander Santana Losada
 */

var Core = new Core();

function Core() {
    //#Public Vars
    this.gameList = new GameList();
    this.playerList = new PlayerList();
    this.sctTable = new SelectableTable(document);
    this.svgHandler = new SvgFunctions(document);
    this.combatHandler = new Combat(document);
    this.serverAnswerParserHandler = new ServerAnswerParser(document);
    
    //#Private Vars
    var thePlayerId = -1;
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
            Core.serverAnswerParserHandler.parseServerAnswers(elem);
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
    };
    
    this.joinLobby = function(){
        connection.joinLobby();
        this.updateGameList();
    };
    
    this.startGame = function(){
        connection.startGame();
    }
    
    this.getPlayerName = function(){
        return thePlayerName;
    };

    this.deletePlayerName = function(){
        connection.leaveLobby();
        thePlayerName = "";
        playerNameRegistered = false;
        document.getElementById("playerName").value = "";

        // revert menu
        showElement(document.getElementById("setPlayerName"));
        hideElement(document.getElementById("selectGame"));

        divs = document.getElementsByClassName('playerNameDisplay');
        [].slice.call(divs).forEach(function(div){div.innerHTML = playerName;});
        this.sctTable.clear("availableGames");
        
        etablishConnection();
    };

    this.backToLobby = function(){
        connection.leaveGame();
        //check response
        connection.joinLobby();
        
        showElement(document.getElementById("selectGame"));
        hideElement(document.getElementById("game"));
    };
    
    this.leaveCreateGame = function(){
        showElement(document.getElementById("selectGame"));
        hideElement(document.getElementById("newGame"));
        
        //cleanup
        document.getElementById("gameName").value = "Spielname";
        document.getElementById("maxPlayers").value = "6";
    }

    this.setGame = function(id){
        if(this.sctTable != null){
            var svg = document.getElementsByTagName('object')[0].contentDocument.getElementsByTagName('svg')[0];
            this.svgHandler.init(svg);
            this.combatHandler.init(svg);
            
            connection.joinGame(parseInt(id));
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
        // validate name
        if(gameName === "")
            return;
        //parse data to server
        connection.createGame(gameName, parseInt(maxPlayers));
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

    this.readyToPlay = function(arg){		
        // send to server : player ready
        connection.setPlayerState(arg);
    };
    
    this.listPlayers = function(){
        connection.listPlayers();
    }
    
    this.clearServerAnswers = function(){
        document.getElementById("serverAnswers").innerHTML = "";
    };
    
    this.getPlayerName = function(){
        return thePlayerName;        
    };
    
    this.setUnitAmount = function(){
        //hideElement(document.getElementById("bottom_overlay"));
        $( "#bottom_overlay" ).slideUp( "slow");
        hideElement(document.getElementById("mutex"));
        
        var select = document.getElementById("unitAmount");
        alert(select.options[select.selectedIndex].value);
        document.getElementById("bottom_overlay").innerHTML = "";
    };
    
    this.hideElement = function(element){
        element.style.display = "none";
    };
    
    this.showElement = function(element){
        element.style.display = "block";
    };
    
    this.createSlider = function(id, idAfter, minValue, maxValue){
        var select = $( "#" + id );
        var slider = $( "<div id='slider'></div>" ).insertAfter( "#" + idAfter ).slider({
            min: minValue,
            max: maxValue,
            range: "min",
            value: select[ 0 ].selectedIndex + 1,
            slide: function( event, ui ) {
                select[ 0 ].selectedIndex = ui.value - 1;
            }
        });
        $( "#" + id ).change(function() {
            slider.slider( "value", this.selectedIndex + 1 );
        });
        var sel = $( "#" + id ).get(0);
        while (sel.options.length > 0) {
            sel.remove(sel.options.length - 1);
        }
        for(var i = minValue; i <= maxValue; i++){
            var opt = document.createElement('option');
            opt.text = i;
            opt.value = i;
            sel.add(opt, null);
        }
        slider.slider( "value", maxValue );
        select.val(maxValue);
    };
    
    this.updatePlayerList = function(){
        var rdy = '<img id="Ready" src="img/ready.png" width="15" align="right"/>';
        var notRdy = '<img id="NoReady" src="img/not_ready.png" width="15" align="right"/>';

        var players = this.playerList.getPlayers();
        for(var i = 0; i < this.playerList.getPlayerAmount(); i++){
            $("#playerList").append(players[i].getPlayerName() + ((players[i].getReadyState() == 1)? rdy : notRdy) + "<br>");
        }
    };
    
    this.setPlayerId = function(id){
        thePlayerId = id;
    };
    
    this.getPlayerId = function(){
        return thePlayerId;
    };
    
    //# Private Methods  
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
    
    var initUnitAmountSelector = function(minValue, maxValue){
        //showElement(document.getElementById("bottom_overlay"));
        $( "#bottom_overlay" ).slideDown( "slow");
        showElement(document.getElementById("mutex"));
        document.getElementById("bottom_overlay").innerHTML = "\
                        <label for='unitAmount'>Anzahl Einheiten</label> \
                        <select name='unitAmount' value='1' id='unitAmount' style='margin-left: 20px;'></select> \
                        <button id='insertSliderAfter' name='setUnitAmount' onClick='Core.setUnitAmount()' style='margin-left: 680px;'>OK</button>";
        Core.createSlider("unitAmount", "insertSliderAfter", minValue, maxValue);
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