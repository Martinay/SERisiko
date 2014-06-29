// ---------------------- #

/**
 *
 * @author Alexander Santana Losada
 */

var Core = new Core();

function Core() {
    //#Public Vars
    this.gameSteps = new GameSteps();
    this.gameList = new GameList();
    this.playerList = new PlayerList();
    this.sctTable = new SelectableTable(document);
    this.svgHandler = new SvgFunctions(document);
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
    this.setPlayerStatus = function(status){
        myData.setPlayerStatus(status);
    };
    this.getPlayerStatus = function(){
        return myData.getPlayerStatus();
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
        //var svg = document.getElementsByTagName('svg')[0];
        this.svgHandler.init(svg);
        this.combatHandler.init(svg); 
        this.unitPlacementHandler.init(svg);
        this.unitMoveHandler.init(svg);
        this.setInGameLobby(true);
        
         // cleanup
        document.getElementById("playerList").innerHTML = "";
        this.playerList.clear();
        this.connectionHandler.listPlayers();
        //verify 
        this.showElement(document.getElementById("game"));
        this.hideElement(document.getElementById("selectGame"));

        // give me some lands test
            this.svgHandler.setNewLandOwner("D2" ,this.getPlayerId());
            this.svgHandler.setNewLandOwner("D1" ,this.getPlayerId());
            this.svgHandler.setNewLandOwner("D7" ,this.getPlayerId());
            this.svgHandler.setNewLandOwner("D6" ,this.getPlayerId());
            this.svgHandler.setNewLandOwner("E1" ,this.getPlayerId());
            this.svgHandler.setNewLandOwner("E3" ,this.getPlayerId());
            this.svgHandler.setNewLandOwner("C4" ,this.getPlayerId());
            this.svgHandler.setNewLandOwner("B5" ,this.getPlayerId());
            this.svgHandler.setNewLandOwner("A1" ,this.getPlayerId());
            this.svgHandler.setNewLandOwner("A5" ,this.getPlayerId());
            this.svgHandler.setNewLandOwner("P4" ,this.getPlayerId());
            this.svgHandler.setNewLandOwner("P12" ,this.getPlayerId());
            
            this.svgHandler.setLandUnitcount("D2" ,1);
            this.svgHandler.setLandUnitcount("D1" , 1 );
            this.svgHandler.setLandUnitcount("D7" , 4);
            this.svgHandler.setLandUnitcount("D6" ,1);
            this.svgHandler.setLandUnitcount("E1" ,1);
            this.svgHandler.setLandUnitcount("E3" ,1);
            this.svgHandler.setLandUnitcount("C4" ,3);
            this.svgHandler.setLandUnitcount("B5" ,2);
            this.svgHandler.setLandUnitcount("A1" ,4);
            this.svgHandler.setLandUnitcount("A5" ,5);
            this.svgHandler.setLandUnitcount("P4" ,2);
            this.svgHandler.setLandUnitcount("P12" ,4);
            
            this.setPlayerStatus(Core.gameSteps.state.FIRSTUNITMOVEMENT);
            
            document.getElementById("gamePhase").disabled = false;
            
        //#
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
    
    this.updatePlayerList = function(){
        var rdy = '<img id="Ready" src="img/ready.png" width="15" align="right"/>';
        var notRdy = '<img id="NoReady" src="img/not_ready.png" width="15" align="right"/>';
        $("#playerList").html("");
        
        var players = this.playerList.getPlayers();
        for(var i = 0; i < this.playerList.getPlayerAmount(); i++){
            $("#playerList").append(players[i].getPlayerName() + ((players[i].getReadyState() == 1)? rdy : notRdy) + "<br>");
        }
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