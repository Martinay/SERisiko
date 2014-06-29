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
        document.getElementById("gamePhase").innerHTML = "Alle Einheiten Platziert";
        document.getElementById("gamePhase").onclick = function() { Core.gameSteps.doUnitPlacement(); };
        document.getElementById("gamePhase").disabled = true;
        document.getElementById("gameStatus").innerHTML = "Sie sind in Iherer Versorgungsphase:<br> Platzieren Sie ihre Einheiten";
        Core.connectionHandler.sendPlaceFirstUnits(Core.unitPlacementHandler.getPlacementArray());
        // After Answer
        Core.svgHandler.refreshOwnerRightsForUnitPlace(3);
        Core.setPlayerStatus(Core.gameSteps.state.UNITPLACEMENT);
        Core.svgHandler.initUnitOnMap();
    };
    
    this.doUnitPlacement = function(){
        Core.setPlayerStatus(Core.gameSteps.state.ATTACK);
        clearDisplay();
        document.getElementById("gamePhase").innerHTML = "Angriffphase Beenden";
        document.getElementById("gamePhase").onclick = function() { Core.gameSteps.doAttackEnd(); };
        document.getElementById("gameStatus").innerHTML = "Sie sind in Iherer Angriffsphase:<br> Erobern Sie neue Länder";
        Core.connectionHandler.sendUnitPlace(Core.unitPlacementHandler.getPlacementArray());
        // After Answer
        Core.svgHandler.refreshOwnerRights();  
    };

    this.doAttackEnd = function(){
        Core.setPlayerStatus(Core.gameSteps.state.UNITMOVEMENT);
        clearDisplay();
        document.getElementById("gamePhase").innerHTML = "Runde Beenden";
        document.getElementById("gamePhase").onclick = function() { Core.gameSteps.doUnitmovement(); };
        document.getElementById("gameStatus").innerHTML = "Sie sind in Iherer Verlegungsphase:<br> Verlegen Sie ihre Einheiten";
        // After Answer
        Core.svgHandler.refreshOwnerRights();        
    };
    
    this.doUnitmovement = function(){
        Core.setPlayerStatus(Core.gameSteps.state.IDLE);
        clearDisplay();
        document.getElementById("gamePhase").innerHTML = "Alle Einheiten Platziert";
        document.getElementById("gamePhase").onclick = function() { Core.gameSteps.doUnitPlacement(); };
        document.getElementById("gamePhase").disabled = true;
        document.getElementById("gameStatus").innerHTML = "Spieler <div id='playerInAction'></div> ist an der Reihe";
        Core.connectionHandler.sendEndRound();
        // After Answer
        Core.svgHandler.refreshOwnerRightsForUnitPlace(3);
        Core.setPlayerStatus(Core.gameSteps.state.UNITPLACEMENT);
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