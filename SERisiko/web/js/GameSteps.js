// ---------------------- #

/**
 *
 * @author Alexander Santana Losada
 */
    
function GameSteps(doc){
    //#Public Vars
    this.state = {
        IDLE: 0,
        SUPPLYDRAW: 1,
        ATTACK: 2,
        DEFEND: 3,
        UNITMOVEMENT: 4,
        UNITPLACEMENT: 5,
        FIRSTUNITPLACEMENT: 6
    };
    
    //#Private Vars
    var gameStep = this.state.IDLE;
    var root = doc;
    
    //# Public Methods
    this.doFirstUnitPlacement = function(){
        this.setGameStep(Core.gameSteps.state.IDLE);
        clearDisplay();
        Core.changeButton("gamePhase", "Nicht am Zug", "", "",  true);
        root.getElementById("gameStatus").innerHTML = "Warten auf die Mitspieler";
        Core.connectionHandler.sendPlaceFirstUnits(Core.unitPlacementHandler.getPlacementArray());
        Core.unitPlacementHandler.clearPlacementArray();
    };
    
    this.doUnitPlacement = function(){
        this.setGameStep(Core.gameSteps.state.IDLE);
        clearDisplay();
        Core.connectionHandler.sendUnitPlace(Core.unitPlacementHandler.getPlacementArray()); 
    };

    this.doAttackEnd = function(){
        this.setGameStep(Core.gameSteps.state.IDLE);
        clearDisplay();
        Core.connectionHandler.listPlayers();
        Core.connectionHandler.sendEndAttack();        
    };
    
    this.doUnitmovement = function(){
        this.setGameStep(Core.gameSteps.state.IDLE);
        clearDisplay();
        Core.connectionHandler.sendEndRound();
    };
    
    this.doDefend = function(attackId, defendId, countAttack, attackState){
        Core.combatHandler.showDefeat(attackId, defendId, countAttack, attackState);
    };
    
    this.getGameStep = function(){
        return gameStep;
    };
    
    this.setGameStep = function(state){
        gameStep = state;
    };
    
    this.clearMap = function(){
        clearDisplay();
    };
    
    this.handleCurrentGameStatus = function(currentGameStatus, arg, status){
        switch(currentGameStatus){
            case "FirstRoundPlacing":
                Core.svgHandler.refreshOwnerRightsForUnitPlace(parseInt(arg));
                root.getElementById("gameStatus").innerHTML = root.getElementById("gameStatus").innerHTML + "<div>Sie haben: " + parseInt(arg) + "<br> Einheiten zur Verfügung</div>";
                break;
            case "PlacingUnits":
                Core.gameSteps.setGameStep(Core.gameSteps.state.UNITPLACEMENT);
                Core.changeButton("gamePhase", "Alle Einheiten Platziert", "", "Core.gameSteps.doUnitPlacement();",  true);
                root.getElementById("gameStatus").innerHTML = "Sie sind in Iherer Versorgungsphase:<br> <span style='color: red;'>Platzieren Sie ihre Einheiten</span>";
                Core.unitPlacementHandler.clearPlacementArray();
                Core.svgHandler.refreshOwnerRightsForUnitPlace(parseInt(arg));
                root.getElementById("gameStatus").innerHTML = root.getElementById("gameStatus").innerHTML + "<div>Sie haben: " + parseInt(arg) + "<br> Einheiten zur Verfügung</div>";
                break;
            case "Attack":
                Core.gameSteps.setGameStep(Core.gameSteps.state.ATTACK);
                Core.changeButton("gamePhase", "Angriffphase Beenden", "", "Core.gameSteps.doAttackEnd();",  false);
                root.getElementById("gameStatus").innerHTML = "Sie sind in Iherer Angriffsphase:<br> <span style='color: red;'>Erobern Sie neue Länder</span>";
                Core.svgHandler.refreshOwnerRights(); 
                break;
            case "Move":
                Core.gameSteps.setGameStep(Core.gameSteps.state.UNITMOVEMENT);
                Core.changeButton("gamePhase", "Einheiten Verlegung Beenden", "", "Core.gameSteps.doUnitmovement();",  false);
                root.getElementById("gameStatus").innerHTML = "Sie sind in Iherer Verlegungsphase:<br> <span style='color: red;'>Verlegen Sie ihre Einheiten</span>";
                Core.svgHandler.refreshOwnerRights();
                break;
            case "Finished":
                Core.showEndOfGame();
                break;
            case "Idle":
                clearDisplay();
                Core.gameSteps.setGameStep(Core.gameSteps.state.IDLE);
                root.getElementById("gameStatus").innerHTML = "Aktiver Spieler: <span style='color: red;'>" + Core.playerList.getPlayerById(parseInt(arg)).getPlayerName() + "</span><br> Phase: <span style='color: blue;'>" + status + "</span>";
                break;    
            default:
                    //nothing
        } 
    };
    
    //Private Methods
    
    var clearDisplay = function(){
        $( "#bottom_overlay" ).slideUp( "slow");
        Core.hideElement(root.getElementById("mutex"));
        root.getElementById("bottom_overlay").innerHTML = "";
        
        root.getElementById("loading_overlay").innerHTML = "";
        root.getElementById("loading_overlay").style.display = "none";
        
        Core.changeButton("gamePhase", "Nicht Am Zug", "", "",  true);
        root.getElementById("gameStatus").innerHTML = "";
        
        Core.svgHandler.setRectsOnClickNull();  
    };
}