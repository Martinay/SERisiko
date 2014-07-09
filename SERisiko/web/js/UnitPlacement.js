/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function UnitPlacement(document){
    var root = document;
    var svgDoc = null;
    var firstRound = true;
    
    var placeUnit = {};
    
    this.init = function(svgElement){
        svgDoc = svgElement;
    };
    
    this.clearPlacementArray = function(){
        placeUnit = {};
    };
    
    this.changefirstRound = function(){
        this.firstRound = false;
    };
    
    this.getfirstRound = function(){
        return this.firstRound;
    };
    
    this.unitPlacement = function (id, maxValue){
        var oldValue = 0;
        var theRect = svgDoc.getElementById(id);
        theRect.onmouseover = new Function("Core.svgHandler.setOpacityOnRect(this.id, 0.5, 'pointer');");
        theRect.onmouseout = new Function("Core.svgHandler.setOpacityOnRect(this.id, 0.5, 'default');");
        $( "#bottom_overlay" ).slideDown( "slow");
        Core.showElement(root.getElementById("mutex"));
        if(placeUnit[id] != null){
            oldValue = parseInt(placeUnit[id]);
            maxValue = parseInt(maxValue) + parseInt(placeUnit[id]);
        }
        root.getElementById("bottom_overlay").innerHTML = "\
                        <label for='unitAmount'>Anzahl Einheiten auf " + id + "</label> \
                        <select name='unitAmount' value='1' id='unitAmount' style='margin-left: 20px;'></select> \
                        <button id='insertSliderAfter' name='setUnitAmount' onClick='Core.unitPlacementHandler.placeUnits(\""+id+"\",\""+maxValue+"\")' style='margin-right: 20px; margin-top: 10px; float: right;'>OK</button>\
                        <button id='abortUnitPlacement' name='abortUnitPlacement' onClick='Core.unitPlacementHandler.cleanPlaceUnits(\""+id+"\")' style='margin-right: 20px; margin-top: 10px; float: right;'>Abbrechen</Button>";
        Core.createSlider("unitAmount", "abortUnitPlacement", 1, maxValue);
        if(oldValue != 0){
            $( "#slider" ).slider( "value", oldValue );
            $("#unitAmount").val(oldValue);
        }
    };
    
    this.placeUnits = function (id, maxValue){
        var theRect = svgDoc.getElementById(id);
        theRect.onmouseover = new Function("Core.svgHandler.setOpacityOnRect(this.id, 0.75, 'pointer');");
        theRect.onmouseout = new Function("Core.svgHandler.setOpacityOnRect(this.id, 1, 'default');");
        svgDoc.getElementById(id + "_back").setAttribute('opacity','1');
        $( "#bottom_overlay" ).slideUp( "slow");
        Core.hideElement(root.getElementById("mutex"));  
        var countSelector = root.getElementById("unitAmount").options[root.getElementById("unitAmount").selectedIndex].value;
        maxValue = maxValue - countSelector;
        placeUnit[id] = parseInt(countSelector);
        Core.svgHandler.setLandUnitcount(id, parseInt(countSelector) + parseInt(Core.svgHandler.getLandUnitcount(id)));
        root.getElementById("bottom_overlay").innerHTML = "";
        if(maxValue == 0){
            Core.svgHandler.setRectsOnClickNull();
            document.getElementById("gamePhase").disabled = false;
        } else {
            Core.svgHandler.refreshOwnerRightsForUnitPlace(maxValue);
        }
    };
    
    this.cleanPlaceUnits = function(id){
        var theRect = svgDoc.getElementById(id);
        theRect.onmouseover = new Function("Core.svgHandler.setOpacityOnRect(this.id, 0.75, 'pointer');");
        theRect.onmouseout = new Function("Core.svgHandler.setOpacityOnRect(this.id, 1, 'default');");
        svgDoc.getElementById(id + "_back").setAttribute('opacity','1');
        $( "#bottom_overlay" ).slideUp( "slow");
        Core.hideElement(root.getElementById("mutex"));
        root.getElementById("bottom_overlay").innerHTML = "";
    };
    
    this.getPlacementArray = function(){
        return JSON.stringify(placeUnit);
    };
}