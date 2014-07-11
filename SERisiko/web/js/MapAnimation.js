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
        var textMov = svgDoc.getElementById(id + '_UnitCount');
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
            setTimeout(animateUnitRemove(id, movementData[1], count), 50);
        } else {
            setTimeout(animateUnitAdd(id, movementData[1], count), 50);
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
    
    this.prepareNewMapOwner = function(source, destination, count, newOwner){
        if(source == ""){
            var textMov = svgDoc.getElementById(destination + '_UnitCount');
            var imageMov = svgDoc.getElementById(destination + '_Unit');
            
            var movementDataText = new Array (parseInt(textMov.getAttribute("x")), parseInt(textMov.getAttribute("y")));
            var movementDataImg = new Array (parseInt(imageMov.getAttribute("x")), parseInt(imageMov.getAttribute("y")), parseInt(imageMov.getAttribute("width")), parseInt(imageMov.getAttribute("height")));
            
            if(movementDataImg[1]-2000 < 0){
                movementDataText = movementDataText[1] - movementDataImg[1];
                movementDataImg[1] = 0;
            } else {
                movementDataImg[1] = movementDataImg[1]-2000;
                movementDataText[1] = movementDataText[1]-2000;
            }
            
            var mapUnitAnimations = svgDoc.getElementById("unitAnimations");
            mapUnitAnimations.innerHTML = mapUnitAnimations.innerHTML + '<text id="' + destination + '_UnitCount_mov" x="' + movementDataText[0] + '" y="' + movementDataText[1] + '" class="fil9 fnt4" text-anchor="middle"> +' + count + '</text>\
                                                                         <image id="' + destination + '_Unit_mov" x="' + movementDataImg[0] + '" y="' + movementDataImg[1] + '" width="' + movementDataImg[2] + '" height="' + movementDataImg[3] + '" xlink:href="/img/player_img/player_red.png" />';
            setTimeout(moveNewMapOwner(destination, movementDataText[1], movementDataImg[1], newOwner, count), 50);
        } else {
            var textMov = svgDoc.getElementById(source + '_UnitCount');
            var imageMov = svgDoc.getElementById(source + '_Unit');
            
            var movementDataTextSource = new Array (parseInt(textMov.getAttribute("x")), parseInt(textMov.getAttribute("y")));
            var movementDataImgSource = new Array (parseInt(imageMov.getAttribute("x")), parseInt(imageMov.getAttribute("y")), imageMov.getAttribute("xlink:href"));
            imageMov = svgDoc.getElementById(destination + '_Unit');
            var movementDataImgDestination = new Array (parseInt(imageMov.getAttribute("x")), parseInt(imageMov.getAttribute("y")));
            var gradient = "";
            if(movementDataImgSource[0] - movementDataImgDestination[0] == 0 || movementDataImgSource[1] - movementDataImgDestination[1] == 0){
                if(movementDataImgSource[0] - movementDataImgDestination[0] == 0){
                    gradient = "y";
                } else {
                    gradient = "x";
                }
            } else {
                 gradient = ((movementDataImgSource[0] - movementDataImgDestination[0])/(movementDataImgSource[1] - movementDataImgDestination[1]))*(-1);
            }
            var mapUnitAnimations = svgDoc.getElementById("unitAnimations");
            mapUnitAnimations.innerHTML = mapUnitAnimations.innerHTML + '<text id="' + destination + '_UnitCount_mov" x="' + movementDataTextSource[0] + '" y="' + movementDataTextSource[1] + '" class="fil9 fnt4" text-anchor="middle"> +' + count + '</text>\
                                                                         <image id="' + destination + '_Unit_mov" x="' + movementDataImgSource[0] + '" y="' + movementDataImgSource[1] + '" width="600" height="800" xlink:href="' + movementDataImgSource[2] + '" />';
            
            setTimeout(moveNewMapOwnerComplete(destination, movementDataTextSource[1], movementDataImgSource[1], gradient, newOwner, count), 50);
        }
    };
    
    var moveNewMapOwnerComplete = function(id, yPositionText, yPositionImg, gradient, newOwner, count){
        if(yPositionText > parseInt(svgDoc.getElementById(id + "_UnitCount").getAttribute("y"))){
            Core.svgHandler.setLandComplete(id, newOwner, count);
            svgDoc.getElementById("unitAnimations").removeChild(svgDoc.getElementById(id + '_UnitCount_mov'));
            svgDoc.getElementById("unitAnimations").removeChild(svgDoc.getElementById(id + '_Unit_mov'));
        } else {
            yPositionText = yPositionText + 40 * gradient;
            yPositionImg = yPositionImg + 40 * gradient;
            svgDoc.getElementById(id + "_UnitCount_mov").setAttribute("y", yPositionText);
            svgDoc.getElementById(id + "_Unit_mov").setAttribute("y", yPositionImg);
            setTimeout(function() {moveNewMapOwnerComplete(id, yPositionText, yPositionImg, gradient, newOwner, count)}, 50);
        }
    };
    
    var moveNewMapOwner = function(id, yPositionText, yPositionImg, newOwner, count){
        if(yPositionText > parseInt(svgDoc.getElementById(id + "_UnitCount").getAttribute("y"))){
            Core.svgHandler.setLandComplete(id, newOwner, count);
            svgDoc.getElementById("unitAnimations").removeChild(svgDoc.getElementById(id + '_UnitCount_mov'));
            svgDoc.getElementById("unitAnimations").removeChild(svgDoc.getElementById(id + '_Unit_mov'));
        } else {
            yPositionText = yPositionText + 40;
            yPositionImg = yPositionImg + 40;
            svgDoc.getElementById(id + "_UnitCount_mov").setAttribute("y", yPositionText);
            svgDoc.getElementById(id + "_Unit_mov").setAttribute("y", yPositionImg);
            setTimeout(function() {moveNewMapOwner(id, yPositionText, yPositionImg, newOwner, count)}, 50);
        }
    };
    
    this.nextUnitTarget = function (source, target, route){        
        if(route.length > 0){
            var tmp_target = route.shift();
            
            var imgMov = svgDoc.getElementById('Runner_Unit_mov');
            var imgAMov = svgDoc.getElementById('Runner_UnitCount_mov');            
            var imgTarget = svgDoc.getElementById(svgDoc.getElementById(tmp_target).getAttribute("id") + '_Unit');
            var imgATarget = svgDoc.getElementById(svgDoc.getElementById(tmp_target).getAttribute("id") + '_UnitCount');

            var movementData = new Array (parseInt(imgMov.getAttribute("x")), parseInt(imgMov.getAttribute("y")), parseInt(imgTarget.getAttribute("x")), parseInt(imgTarget.getAttribute("y")));
            var movementAData = new Array (parseInt(imgAMov.getAttribute("x")),parseInt(imgAMov.getAttribute("y")), parseInt(imgATarget.getAttribute("x")), parseInt(imgATarget.getAttribute("y")));
            var xDirection = "-";
            var yDirection = "-";
            if (movementData[0] < movementData[2])
                xDirection = "+";
            if (movementData[1] < movementData[3])
                yDirection = "+"; 

            this.moveUnitToTarget(movementData, movementAData, imgMov, imgAMov, xDirection, yDirection, tmp_target, target, route);
         }
         else{
            this.killDomElement(imgMov);
            this.killDomElement(imgAMov);
        }
    };
    
    this.moveUnitToTarget = function(movementData, movementAData, imgMov, imgAMov, xDirection, yDirection, tmp_target, target, route){
        var finished = 0;
        if(xDirection == "+"){
            if (movementData[0] >= movementData[2])
                finished++;
            if (movementAData[0] >= movementAData[2])
                finished++; 
        }
        else{
            if (movementData[0] <= movementData[2])
               finished++;
            if (movementAData[0] <= movementAData[2])
                finished++;
        }
        if(yDirection == "+"){
            if (movementData[1] >= movementData[3])
                finished++;  
            if (movementAData[1] >= movementAData[3])
                finished++;
        }
        else{
            if (movementData[1] <= movementData[3])
                finished++;   
            if (movementAData[1] <= movementAData[3])
                finished++;
        }
        if(finished < 4){     
            if(xDirection == "+"){
                if (movementData[0] < movementData[2]){
                    movementData[0] += 5; 
                    imgMov.setAttribute("x", movementData[0]);
                }
                if (movementAData[0] < movementAData[2]){
                    movementAData[0] += 5; 
                    imgAMov.setAttribute("x", movementAData[0]);       
                 }
            }
            else{
                if (movementData[0] > movementData[2]){
                    movementData[0] -= 5; 
                    imgMov.setAttribute("x", movementData[0]);
                }
                if (movementAData[0] > movementAData[2]){
                    movementAData[0] -= 5;
                    imgAMov.setAttribute("x", movementAData[0]);
                }
            }
            if(yDirection == "+"){
                if (movementData[1] < movementData[3]){
                    movementData[1] += 5; 
                    imgMov.setAttribute("y", movementData[1]);
                }
                if (movementAData[1] < movementAData[3]){
                    movementAData[1] += 5;
                    imgAMov.setAttribute("y", movementAData[1]);
                }
            }
            else{
                if (movementData[1] > movementData[3]){
                    movementData[1] -= 5; 
                    imgMov.setAttribute("y", movementData[1]);
                }
                if (movementAData[1] > movementAData[3]){
                    movementAData[1] -= 5; 
                    imgAMov.setAttribute("y", movementAData[1]);
                }
            }
            setTimeout(this.moveUnitToTarget(movementData, movementAData, imgMov, imgAMov, xDirection, yDirection, tmp_target, target, route), 50);
        } 
        else{
            this.nextUnitTarget(tmp_target, target, route);
        }
    };
    
    this.killDomElement = function(element) {  // BE CARFEUL THIS FUNCTION IS EVIL IT KILLS THE POOR DOM ELEMENTS !!! .... R.I.P. ....
        if (element) {
            var padre = element.parentNode;
            if (padre) padre.removeChild(element);
        }
    };
}