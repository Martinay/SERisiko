/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
function MapAnimation(doc){
    var root = doc;
    var svgDoc = null;
    
    this.init = function(svgDocument){
        svgDoc = svgDocument;
    };
    
    this.prepareUnitAddRemove = function(id, count){
        var textMov = svgDoc.getElementById(svgDoc.getElementById(id).getAttribute("id") + '_UnitCount');
        var movementData = new Array (parseInt(textMov.getAttribute("x")), parseInt(textMov.getAttribute("y")));
       
        var tempCount = parseInt(count) - parseInt(svgDoc.getElementById(id).getAttribute("unitcount"));
        var fillstyle = "fil9";
        var vorzeichen = "+ ";
        
        if(tempCount < 0){
            fillstyle = "fil8";
            vorzeichen = "- ";
            
        } else {
            if(movementData[1]-2000 < 0){
                movementData[1] = 0;
            } else {
                movementData[1] = movementData[1]-2000;
            } 
        }
       
        var mapUnitAnimations = svgDoc.getElementById("unitAnimations");
        mapUnitAnimations.innerHTML = mapUnitAnimations.innerHTML + '<text id="' + id + '_UnitCount_mov" x="' + movementData[0] + '" y="' + movementData[1] + '" class="'+ fillstyle +' fnt4" text-anchor="middle"> ' + vorzeichen + tempCount + '</text>';
        if(tempCount < 0){
            setTimeout(animateUnitRemove(id, movementData[1], count));
        } else {
            setTimeout(animateUnitAdd(id, movementData[1], count));
        }
    };

    var animateUnitAdd = function(id, yPosition, count){
        if(yPosition > parseInt(svgDoc.getElementById(id + "_UnitCount").getAttribute("y"))){
            Core.svgHandler.setLandUnitcount(id, count);
            svgDoc.getElementById("unitAnimations").removeChild(svgDoc.getElementById(id + '_UnitCount_mov'));
        } else {
            yPosition = yPosition + 40;
            svgDoc.getElementById(id + "_UnitCount_mov").setAttribute("y", yPosition);
            setTimeout(function() {animateUnitAdd(id, yPosition, count)}, 50);
        }
    };
    
    var animateUnitRemove = function(id, yPosition, count){
        if(yPosition < parseInt(svgDoc.getElementById(id + "_UnitCount").getAttribute("y")) - 2000){
            Core.svgHandler.setLandUnitcount(id, count);
            svgDoc.getElementById("unitAnimations").removeChild(svgDoc.getElementById(id + '_UnitCount_mov'));
        } else {
            yPosition = yPosition - 40;
            svgDoc.getElementById(id + "_UnitCount_mov").setAttribute("y", yPosition);
            setTimeout(function() {animateUnitRemove(id, yPosition, count)}, 50);
        }
    };
    
    this.prepareNewMapOwner = function(source, destination, count){
        
    };
}
