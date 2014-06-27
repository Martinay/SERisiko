/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function UnitMove(document){
    var root = document;
    var svgDoc = null;
    
    this.init = function(svgElement){
        svgDoc = svgElement;
    };
    
    this.selectCountMoveUnits = function(source, destination){
        Core.showElement(root.getElementById("mutex"));
        if(parseInt(svgDoc.getElementById(source).getAttribute("Unitcount")) != 1){
            root.getElementById("bottom_overlay").innerHTML = "\
                            <label for='unitAmount'>Anzahl Einheiten von: " + source + " nach: " + destination + "</label> \
                            <select name='unitAmount' value='1' id='unitAmount' style='margin-left: 20px;'></select> \
                            <button id='abortUnitPlacement' name='abortUnitPlacement' onClick='Core.unitMoveHandler.abortUnitMove()' style='margin-left: 460px;'>Abbrechen</Button>\
                            <button id='insertSliderAfter' name='setUnitAmount' onClick='Core.unitMoveHandler.moveUnits(\""+source+"\",\""+destination+"\")' style='margin-left: 20px;'>OK</button>";
            Core.createSlider("unitAmount", "insertSliderAfter", 1, (parseInt(svgDoc.getElementById(source).getAttribute("Unitcount")) - 1));
        } else {
            this.abortUnitMove();
        }
    };
    
    this.moveUnits = function(source, destination){ 
        var countSelector = root.getElementById("unitAmount").options[root.getElementById("unitAmount").selectedIndex].value;
        Core.connectionHandler.sendUnitMove(source, destination, countSelector);
        $( "#bottom_overlay" ).slideUp( "slow");
        Core.hideElement(root.getElementById("mutex"));
        root.getElementById("bottom_overlay").innerHTML = "";
        Core.svgHandler.setRectsOnClickNull();
    };
    
    this.abortUnitMove = function(){
        $( "#bottom_overlay" ).slideUp( "slow");
        Core.hideElement(root.getElementById("mutex"));
        root.getElementById("bottom_overlay").innerHTML = "";
        Core.svgHandler.setRectsOnClickNull();
        Core.svgHandler.refreshOwnerRights();
    };
}