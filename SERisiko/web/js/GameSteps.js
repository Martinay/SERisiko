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
        UNITMOVEMENT: 4
    };
    //#Private Vars
    var gameStep = state.IDLE;
    
    //# Public Methods
    this.doIdle = function(){
        
    };
    this.doSupplyDraw = function(){
        
    };
    this.doAttack = function(){
        
    };
    this.doDefend = function(){
        
    };
    this.doUnitmovement = function(){
        
    };
    
    this.getGameStep = function(){
        return gameStep;
    };
    this.setGameStep = function(state){
        gameStep = state;
    };
    //# Private Methods
    
}