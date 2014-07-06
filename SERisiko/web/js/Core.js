// ---------------------- #

/**
 *
 * @author Alexander Santana Losada
 */

var Core = new Core();

function Core() {
    //#Public Vars
    this.gameSteps = new GameSteps(document);
    this.gameList = new GameList();
    this.playerList = new PlayerList();
    this.sctTable = new SelectableTable(document);
    this.svgHandler = new SvgFunctions(document);
    this.attackHandler = new Attack(document);
    this.defendHandler = new Defend(document);
    this.combatHandler = new Combat(document);
    this.serverAnswerParserHandler = new ServerAnswerParser(document);
    this.unitMoveHandler = new UnitMove(document);
    this.unitPlacementHandler = new UnitPlacement(document);
    this.connectionHandler = new Connection();  // also inits Connection
    
    //#Private Vars
    var myData = new MyDataObject();
    var gameRunning = false;
    
    //# Public Methods
    this.setPlayerName = function(){
        var name = document.getElementById("playerName").value;
        if(name == "" || !validate(name))
            return false;
        myData.setPlayerName(name);
        
        
        // create Player on Server + joinLobby
        this.connectionHandler.joinServer(name); // includes joinlobby
    };
    
    //# MyData Setters and Getters
    this.getPlayerName = function(){
        return myData.getPlayerName();
    };
   
    this.setPlayerId = function(id){
        myData.setPlayerId(id);
    };
    
    this.getPlayerId = function(){
        return myData.getPlayerId();
    };
    
    this.setInGameLobby = function(arg){
        myData.setInGameLobby(arg);
    };
    
    this.isInGameLobby = function(){
        return myData.isInGameLobby();
    };
    
    this.setGameRunning = function(arg){
        gameRunning = arg;
    };
    
    this.isGameRunning = function(){
        return gameRunning;
    };
    //##############################
    
    this.updatePlayerList = function(){
        var rdy = "img/ready.png";
        var notRdy = "img/not_ready.png";
        var defeated = "/img/defeated.png";
        var not_play = "img/not_play.png"
        $("#playerList").html("");
        
        var players = this.playerList.getPlayers();
        for(var i = 0; i < this.playerList.getPlayerAmount(); i++){
             if(players[i] != null){
                if(gameRunning == false){
                    $("#playerList").append(players[i].getPlayerName() + ((players[i].getReadyState() == 1)? "<img id='" + players[i].getPlayerId() + "' src='" + rdy + "' width='15' align='right'/>"  : "<img id='" + players[i].getPlayerId() + "' src='" + notRdy + "' width='15' align='right'/>") + "<br>");
                } else {
                    if(players[i].getPlayerStatus() == "Defeated"){
                        $("#playerList").append(players[i].getPlayerName() + "<img id='" + players[i].getPlayerId() + "' src='" + defeated + "' width='15' align='right'/><br>");
                    } else {
                        $("#playerList").append(players[i].getPlayerName() + "<img id='" + players[i].getPlayerId() + "' src='" + not_play + "' width='15' align='right'/><br>");
                    }
                }
            }
        }
    };
    
    this.changePlayerListPic = function(CurrentPlayerId){
        var players = this.playerList.getPlayers();
        for(var i = 0; i < this.playerList.getPlayerAmount(); i++){
            if(players[i] != null){
                console.log(players[i].getPlayerStatus());
                if(players[i].getPlayerStatus() == "Defeated"){
                    if(this.getPlayerId() == CurrentPlayerId){
                        document.getElementById("loading_overlay").style.display = "block";
                        document.getElementById("loading_overlay").innerHTML = "<div style='color:red; font-size: 28px;'>Sie haben verloren!</div><br /><br />\n\
                                                                            <button style='margin-top: 20px;' name='clearShowDefeat' onClick='Core.backToLobby()'>Anzeige Schließen</button>";
                    } else {
                        $("#" + players[i].getPlayerId()).attr("src", "img/defeated.png");
                    }
                }else {
                    if(players[i].getPlayerId() == CurrentPlayerId){
                        $("#" + players[i].getPlayerId()).attr("src", "img/play.png");
                    } else {
                        $("#" + players[i].getPlayerId()).attr("src", "img/not_play.png");
                    } 
                }
            }
        }
    };
    
    this.deletePlayerName = function(){
        this.connectionHandler.leaveLobby();
        myData.setPlayerName("");
        document.getElementById("playerName").value = "";

        // revert menu
        showElement(document.getElementById("setPlayerName"));
        hideElement(document.getElementById("selectGame"));

        divs = document.getElementsByClassName('playerNameDisplay');
        [].slice.call(divs).forEach(function(div){div.innerHTML = playerName;});
        this.sctTable.clear("availableGames");
        
        this.connectionHandler.init();
    };

    this.backToLobby = function(){
        this.connectionHandler.leaveGame();        
        this.setInGameLobby(false);
        
        showElement(document.getElementById("selectGame"));
        hideElement(document.getElementById("game"));
        
        this.playerList.clear();
        $("#playerList").html("");
        $("#startGame").html("");
        $("#gameStatus").html("Bitte melden Sie sich Spielbereit");
        
        
        this.changeButton("gamePhase", "Bereit zum Spielen", "", "Core.connectionHandler.setPlayerState(true);", false);
        $("#gameMap").html('<object data="maps/map_dhbw.svg" id="svg_obj" type="image/svg+xml"><img id="svg_obj" src="maps/map_dhbw.jpg" alt="Playmap - DHBW"/></object><!-- Map Blocker --><div id="mutex"></div><!-- Select Unit Amount Overlay --><div id ="bottom_overlay"></div><!-- Loading Overlay --><div id="loading_overlay"></div>');
    };
    
    this.leaveCreateGame = function(){
        showElement(document.getElementById("selectGame"));
        hideElement(document.getElementById("newGame"));
        
        //cleanup
        document.getElementById("gameName").value = "Spielname";
        document.getElementById("maxPlayers").value = "6";
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
        if(gameName === "" || !validate(gameName))
            return;
        //parse data to server
        this.connectionHandler.createGame(gameName, parseInt(maxPlayers));
    };
    
    this.prepareJoinedGame = function(){
        var svg = document.getElementsByTagName('object')[0].contentDocument.getElementsByTagName('svg')[0];
        this.svgHandler.init(svg);
        this.unitPlacementHandler.init(svg);
        
        this.setInGameLobby(true);
        
        document.getElementById("gamePhase").disabled = false;
        
         // cleanup
        document.getElementById("playerList").innerHTML = "";
        this.playerList.clear();
        this.connectionHandler.listPlayers();
        //verify 
        this.showElement(document.getElementById("game"));
        this.hideElement(document.getElementById("selectGame"));
    };
    
    this.showEndOfGame = function(){
        var players = this.playerList.getPlayers();
        for(var i = 0; i < this.playerList.getPlayerAmount(); i++){
            if(players[i] != null){
                if(player[i].getPlayerId() == this.getPlayerId && getplayers[i].getPlayerStatus() != "Defeated"){
                    document.getElementById("loading_overlay").innerHTML = "<div style='color:green; font-size: 28px;'>Sie haben gewonnen!</div><br /><br />\n\
                                                                            <button style='margin-top: 20px;' name='LeaveGame' onClick='Core.backToLobby();'>Spiel Verlassen</button>";
                } else {
                    document.getElementById("loading_overlay").innerHTML = "<div style='color:red; font-size: 28px;'>Sie haben verloren!</div><br /><br />\n\
                                                                            <button style='margin-top: 20px;' name='LeaveGame' onClick='Core.backToLobby();'>Spiel Verlassen</button>";
                } 
            }
        }
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
    
    this.clearServerAnswers = function(){
        document.getElementById("serverAnswers").innerHTML = "";
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
    
    
    
    this.changeButton = function(id, innerhtml, onclick_params, onclick_function, state){
        document.getElementById(id).innerHTML = innerhtml;
        document.getElementById(id).onclick = new Function (onclick_params, onclick_function);
        document.getElementById(id).disabled = state;
    };
    
    //# Private Methods  
    var hideElement = function(element){
        element.style.display = "none";
    };
    
    var showElement = function(element){
        element.style.display = "block";
    };
    
    var validate = function(str){
        var nameRegex = /^[a-zA-Z0-9]+$/;
        var valid = str.match(nameRegex);
        if(valid === null){
            return false;
        }
        return true;
    };
}
// ---------------------- #