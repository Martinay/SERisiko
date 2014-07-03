// ---------------------- #

/**
 *
 * @author Alexander Santana Losada
 */
    
function GameSteps(){
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
    
    //# Public Methods
    this.doIdle = function(){
        clearDisplay();
    };
    
    this.doFirstUnitPlacement = function(){
        Core.setPlayerStatus(Core.gameSteps.state.IDLE);
        clearDisplay();
        Core.changeButton("gamePhase", "Nicht am Zug", "", "",  true);
        document.getElementById("gameStatus").innerHTML = "Warten auf die Mitspieler";
        Core.connectionHandler.sendPlaceFirstUnits(Core.unitPlacementHandler.getPlacementArray());
        Core.unitPlacementHandler.clearPlacementArray();
    };
    
    this.doUnitPlacement = function(){
        Core.setPlayerStatus(Core.gameSteps.state.IDLE);
        clearDisplay();
        Core.changeButton("gamePhase", "", "", "",  true);
        document.getElementById("gameStatus").innerHTML = "Sie sind in Iherer Angriffsphase:<br> Erobern Sie neue Länder";
        Core.connectionHandler.sendUnitPlace(Core.unitPlacementHandler.getPlacementArray()); 
        //  After Answer
        Core.setPlayerStatus(Core.gameSteps.state.ATTACK);
        Core.svgHandler.refreshOwnerRights(); 
        Core.changeButton("gamePhase", "Angriffphase Beenden", "", "Core.gameSteps.doAttackEnd();",  false);
    };

    this.doAttackEnd = function(){
        Core.setPlayerStatus(Core.gameSteps.state.IDLE);
        clearDisplay();
        Core.changeButton("gamePhase", "", "", "",  true);
        document.getElementById("gameStatus").innerHTML = "Sie sind in Iherer Verlegungsphase:<br> Verlegen Sie ihre Einheiten";
        Core.connectionHandler.sendEndAttack();        
    };
    
    this.doUnitmovement = function(){
        Core.setPlayerStatus(Core.gameSteps.state.IDLE);
        clearDisplay();
        Core.changeButton("gamePhase", "Nicht am Zug", "", "",  true);
        document.getElementById("gameStatus").innerHTML = "";
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
    
    //Private Methods
    
    var clearDisplay = function(){
        $( "#bottom_overlay" ).slideUp( "slow");
        Core.hideElement(document.getElementById("mutex"));
        document.getElementById("bottom_overlay").innerHTML = "";
        
        document.getElementById("loading_overlay").innerHTML = "";
        document.getElementById("loading_overlay").style.display = "none";
        
        Core.svgHandler.setRectsOnClickNull();
    };
}