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
    this.mapAnimationHandler = new MapAnimation(document);
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
        if(name === "" || !validate(name)){
            document.getElementById("errorInName").innerHTML = "Ihren Spielernamen können wir so nicht verwenden.<br /> Bitte geben Sie einen Spielernamen ein der nur aus Buchstaben und Zahlen besteht (maximal 15 Zeichen)";
        } else{
            myData.setPlayerName(name);
            // create Player on Server + joinLobby
            this.connectionHandler.joinServer(name); // includes joinlobby
        }
    };
    
    //# MyData Setters and Getters
    this.getPlayerName = function(){
        return myData.getPlayerName();
    };
    
    this.setPlayerId = function(id){
        myData.setPlayerId(id);
    };
    
    this.setGameId = function(id){
        myData.setGameId(id);
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
    
    this.getGameId = function(){
        return myData.getGameId();
    }
    
    this.setGameName = function(id){
        document.getElementById("gameNameAnzeige").innerHTML = this.gameList.getGameNameById(id);
    };
    //##############################
    
    this.updatePlayerList = function(){
        var rdy = "img/ready.png";
        var notRdy = "img/not_ready.png";
        var defeated = "/img/defeated.png";
        var not_play = "img/not_play.png";
        $("#playerList").html("");
        
        var players = this.playerList.getPlayers();
        for(var i = 0; i < this.playerList.getPlayerAmount(); i++){
             if(players[i] !== null){
                if(gameRunning === false){
                    var div = document.createElement("div");
                    div.style.height = "30px";
                    div.innerHTML = players[i].getPlayerName() + ((players[i].getReadyState() === true)? "<img id='" + players[i].getPlayerId() + "' src='" + rdy + "' width='20' align='right'/>"  : "<img id='" + players[i].getPlayerId() + "' src='" + notRdy + "' width='20' align='right'/>");
                    $("#playerList").append(div);
                } else {
                    if(players[i].getPlayerStatus() === "Defeated"){
                        var div = document.createElement("div");
                        div.style.height = "30px";
                        div.innerHTML = "<img src='" + Core.svgHandler.getPlayerColor(players[i].getPlayerId()) + "' width='20' align='left' />" + players[i].getPlayerName() + "<img id='" + players[i].getPlayerId() + "' src='" + defeated + "' width='20' align='right'/>";
                        $("#playerList").append(div);
                    } else {
                        var div = document.createElement("div");
                        div.style.height = "30px";
                        div.innerHTML = "<img src='" + Core.svgHandler.getPlayerColor(players[i].getPlayerId()) + "' width='20' align='left' />" + players[i].getPlayerName() + "<img id='" + players[i].getPlayerId() + "' src='" + not_play + "' width='20' align='right'/>";
                        $("#playerList").append(div);
                    }
                }
            }
        }
    };
    
    this.changePlayerListPic = function(CurrentPlayerId){
        var players = this.playerList.getPlayers();
        for(var i = 0; i < this.playerList.getPlayerAmount(); i++){
            if(players[i] !== null){
                if(players[i].getPlayerStatus() === "Defeated"){
                    if(this.getPlayerId() === players[i].getPlayerId()){
                        document.getElementById("loading_overlay").style.display = "block";
                        document.getElementById("loading_overlay").innerHTML = "<div style='color:red; font-size: 28px;'>Sie haben verloren!</div><br /><br />\n\
                                                                            <button style='margin-top: 20px;' name='clearShowDefeat' onClick='Core.backToLobby()'>Anzeige Schließen</button>";
                    } else {
                        $("#" + players[i].getPlayerId()).attr("src", "img/defeated.png");
                    }
                }else {
                    if(players[i].getPlayerId() === CurrentPlayerId){
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
        this.clearDisplayBackToLobby();
    };
    
    this.clearDisplayBackToLobby = function(){
        this.setInGameLobby(false);
        
        showElement(document.getElementById("selectGame"));
        hideElement(document.getElementById("game"));
        
        this.setGameRunning(false);
        this.playerList.clear();
        $("#playerList").html("");
        $("#startGame").html("");
        $("#gameStatus").html("Bitte melden Sie sich Spielbereit");
        $("#chatbox").html("");
        $("#usermsg").html("");
        
        this.clearOpenGames();
        
        this.changeButton("gamePhase", "Bereit zum Spielen", "", "Core.connectionHandler.setPlayerState(true);", false);
        $("#gameMap").html('<object data="maps/map_dhbw.svg" type="image/svg+xml" width="950" height="660">Die Map ist ein SVG-Objekt, welches leider in Ihrem Browser nicht angezeigt werden kann.</object><!-- Map Blocker --><div id="mutex"></div><!-- Select Unit Amount Overlay --><div id ="bottom_overlay"></div><!-- Loading Overlay --><div id="loading_overlay"></div>');
    };
    
    this.clearOpenGames = function(){
        if(this.sctTable !== null){
            this.sctTable.clear("availableGames");
            this.gameList.clear();
        } 
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
        if(gameName === "" || !validate(gameName)){
            document.getElementById("errorInGameName").innerHTML = "Ihren Gamenamen können wir so nicht verwenden.<br /> Bitte geben Sie einen Gamenamen ein der nur aus Buchstaben und Zahlen besteht (maximal 15 Zeichen)";
        }else {
            //parse data to server
            this.connectionHandler.createGame(gameName, parseInt(maxPlayers));
        }
    };
    
    this.prepareJoinedGame = function(id){
        var svg = document.getElementsByTagName('object')[0].contentDocument.getElementsByTagName('svg')[0];
        this.svgHandler.init(svg);
        this.unitPlacementHandler.init(svg);
        this.mapAnimationHandler.init(svg);
        
        this.setInGameLobby(true);
        this.setGameId(id);
        
        document.getElementById("gamePhase").disabled = false;
        
         // cleanup
        document.getElementById("playerList").innerHTML = "";
        this.playerList.clear();
        this.connectionHandler.listPlayers();
        //verify 
        this.hideElement(document.getElementById("selectGame"));
    };
    
    this.validateChatMessage = function(){
        if(validateMessage(document.getElementById("usermsg").value)){
            this.connectionHandler.sendChatMessage(document.getElementById("usermsg").value);
            document.getElementById("usermsg").value = "";
        }
    };
    
    this.showEndOfGame = function(playerId){
        document.getElementById("loading_overlay").style.display = "block";
        if(parseInt(playerId) === this.getPlayerId()){
            document.getElementById("loading_overlay").innerHTML = "<div style='color:green; font-size: 28px;'>Sie haben gewonnen!</div><br /><br />\n\
                                                                    <button style='margin-top: 20px;' name='LeaveGame' onClick='Core.backToLobby();'>Spiel Verlassen</button>";
        } else {
            document.getElementById("loading_overlay").innerHTML = "<div style='color:red; font-size: 28px;'>Sie haben verloren!</div><br /><br />\n\
                                                                    <button style='margin-top: 20px;' name='LeaveGame' onClick='Core.backToLobby();'>Spiel Verlassen</button>";
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
                if(key === 13)
                    this.setPlayerName();
                break;
            case "usermsg":
                if(key === 13)
                    this.validateChatMessage();
                break;
            case "newGame":
                if(key === 13)
                     this.createNewGame();
                break;
            case "newGameAmount":
                if (key === 13){
                    document.getElementById("maxPlayers").value = this.minmax(document.getElementById("maxPlayers").value, 2, 6)
                    this.createNewGame();
                }
                else
                    document.getElementById("maxPlayers").value = this.minmax(document.getElementById("maxPlayers").value, 2, 6)
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
    
    /*
     * sleep1 in ms function
     * choose one
     */
    this.sleep = function(milliseconds) {
      var start = new Date().getTime();
      for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds){
          break;
        }
      }
    };
    
    /*
     * sleep2 in ms function
     * choose one
     */
    function sleep(millis, callback) {
        setTimeout(function() { callback(); } , millis);
    };
    
    //# Private Methods  
    var hideElement = function(element){
        element.style.display = "none";
    };
    
    var showElement = function(element){
        element.style.display = "block";
    };
    
    var validate = function(str){
        var nameRegex = /^[a-zA-Z0-9$äöüÄÖÜ]+$/;
        var valid = str.match(nameRegex);
        if(valid === null){
            return false;
        }
        if(str.length > 15)
            return false;
        return true;
    };
    var validateMessage = function(str){
        var nameRegex = /^[\w\d\s();,.:\[\]{}=?ßäöüÄÖÜ\-_*-+~'#^°²³!"§$%&\\/´`@€|]+$/;
        var valid = str.match(nameRegex);
        if(valid === null){
            return false;
        }
        return true;
    };
}
// ---------------------- #