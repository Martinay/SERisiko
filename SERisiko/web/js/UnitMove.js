/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function UnitMove(document){
    var root = document;
    
    this.selectCountMoveUnits = function(source, destination){
        Core.showElement(root.getElementById("mutex"));
        if(parseInt(Core.svgHandler.getLandUnitcount(source)) !== 1){
            root.getElementById("bottom_overlay").innerHTML = "\
                            <label for='unitAmount'>Anzahl Einheiten von: " + source + " nach: " + destination + "</label> \
                            <select name='unitAmount' value='1' id='unitAmount' style='margin-left: 20px;'></select> \
                            <button id='insertSliderAfter' name='setUnitAmount' onClick='Core.unitMoveHandler.moveUnits(\""+source+"\",\""+destination+"\")'>OK</button>\
                            <button id='abortUnitPlacement' name='abortUnitPlacement' onClick='Core.unitMoveHandler.clearUnitMoveDisplay()'>Abbrechen</Button>";
            Core.createSlider("unitAmount", "abortUnitPlacement", 1, (parseInt(Core.svgHandler.getLandUnitcount(source)) - 1));
        } else {
            this.clearUnitMoveDisplay();
        }
    };
    
    this.moveUnits = function(source, destination){ 
        var countSelector = root.getElementById("unitAmount").options[root.getElementById("unitAmount").selectedIndex].value;
        Core.connectionHandler.sendUnitMove(source, destination, parseInt(countSelector));
        root.getElementById("gameMap").style.height = "660px";
        root.getElementById("bottom_overlay").style.height = "70px";
        $( "#bottom_overlay" ).slideUp( "slow");
        Core.hideElement(root.getElementById("mutex"));
        root.getElementById("bottom_overlay").innerHTML = "";
        Core.svgHandler.setRectsOnClickNull();
    };
    
    this.clearUnitMoveDisplay = function(){
        root.getElementById("gameMap").style.height = "660px";
        root.getElementById("bottom_overlay").style.height = "70px";
        $( "#bottom_overlay" ).slideUp( "slow");
        Core.hideElement(root.getElementById("mutex"));
        root.getElementById("bottom_overlay").innerHTML = "";
        Core.svgHandler.setRectsOnClickNull();
        Core.svgHandler.refreshOwnerRights();
    };
}