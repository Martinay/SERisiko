/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function UnitPlacement(document){
    var root = document;
    var svgDoc = null;
    
    var placeUnitI = 0;
    var placeUnitLand = new Array();
    var placeUnitCount = new Array();
    
    this.init = function(svgElement){
        svgDoc = svgElement;
    };
    
    this.unitPlacement = function (id, maxValue){
        svgDoc.getElementById(id + "_back").setAttribute('opacity','0.5');
        $( "#bottom_overlay" ).slideDown( "slow");
        Core.showElement(root.getElementById("mutex"));
        root.getElementById("bottom_overlay").innerHTML = "\
                        <label for='unitAmount'>Anzahl Einheiten auf " + id + "</label> \
                        <select name='unitAmount' value='1' id='unitAmount' style='margin-left: 20px;'></select> \
                        <button id='abortUnitPlacement' name='abortUnitPlacement' onClick='Core.unitPlacementHandler.abortPlaceUnits(\""+id+"\")' style='margin-left: 530px;'>Abbrechen</Button>\
                        <button id='insertSliderAfter' name='setUnitAmount' onClick='Core.unitPlacementHandler.placeUnits(\""+id+"\",\""+maxValue+"\")' style='margin-left: 20px;'>OK</button>";
        Core.createSlider("unitAmount", "insertSliderAfter", 1, maxValue);
    };
    
    this.placeUnits = function (id, maxValue){
        svgDoc.getElementById(id + "_back").setAttribute('opacity','1');
        $( "#bottom_overlay" ).slideUp( "slow");
        Core.hideElement(root.getElementById("mutex"));  
        var countSelector = root.getElementById("unitAmount").options[root.getElementById("unitAmount").selectedIndex].value;
        maxValue = maxValue - countSelector;
        Core.svgHandler.setLandUnitcount(id, parseInt(countSelector) + parseInt(Core.svgHandler.getLandUnitcount(id)));
        if(placeUnitLand.indexOf(id) == -1){
            placeUnitLand[placeUnitI] = id;
            placeUnitCount[placeUnitI] = parseInt(countSelector) + parseInt(Core.svgHandler.getLandUnitcount(id));
        } else {
            placeUnitCount[placeUnitLand.indexOf(id) + 1] = parseInt(countSelector) + parseInt(Core.svgHandler.getLandUnitcount(id));
        }
       
        root.getElementById("bottom_overlay").innerHTML = "";
        if(maxValue == 0){
            Core.svgHandler.refreshOwnerRights();
        } else {
            Core.svgHandler.refreshOwnerRightsForUnitPlace(maxValue);
        }
        placeUnitI++;
    };
    
    this.abortPlaceUnits = function(id){
        svgDoc.getElementById(id + "_back").setAttribute('opacity','1');
        $( "#bottom_overlay" ).slideUp( "slow");
        Core.hideElement(root.getElementById("mutex"));
        root.getElementById("bottom_overlay").innerHTML = "";
    };
}