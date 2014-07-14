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
        Core.svgHandler.setLandUnitcount(id, count);
        if(tempCount < 0){
            setTimeout(animateUnitRemove(id, movementData[1]), 50);
        } else {
            setTimeout(animateUnitAdd(id, movementData[1]), 50);
        }
    };

    var animateUnitAdd = function(id, yPosition){
        if(yPosition > parseInt(svgDoc.getElementById(id + "_UnitCount").getAttribute("y"))){
            Core.svgHandler.changeLandVisible(id);
            svgDoc.getElementById("unitAnimations").removeChild(svgDoc.getElementById(id + '_UnitCount_mov'));
        } else {
            yPosition = yPosition + 40;
            svgDoc.getElementById(id + "_UnitCount_mov").setAttribute("y", yPosition);
            setTimeout(function() {animateUnitAdd(id, yPosition)}, 50);
        }
    };
    
    var animateUnitRemove = function(id, yPosition){
        if(yPosition < parseInt(svgDoc.getElementById(id + "_UnitCount").getAttribute("y")) - 2000){
            Core.svgHandler.changeLandVisible(id);
            svgDoc.getElementById("unitAnimations").removeChild(svgDoc.getElementById(id + '_UnitCount_mov'));
        } else {
            yPosition = yPosition - 40;
            svgDoc.getElementById(id + "_UnitCount_mov").setAttribute("y", yPosition);
            setTimeout(function() {animateUnitRemove(id, yPosition)}, 50);
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
            
            Core.svgHandler.setLandComplete(destination, newOwner, count);
            setTimeout(moveNewMapOwner(destination, movementDataText[1], movementDataImg[1]), 50);
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
            Core.svgHandler.setLandComplete(destination, newOwner, count);
            setTimeout(moveNewMapOwnerComplete(destination, movementDataTextSource[1], movementDataImgSource[1], gradient), 50);
        }
    };
    
    var moveNewMapOwnerComplete = function(id, yPositionText, yPositionImg, gradient){
        if(yPositionText > parseInt(svgDoc.getElementById(id + "_UnitCount").getAttribute("y"))){
            Core.svgHandler.changeLandVisible(id);
            svgDoc.getElementById("unitAnimations").removeChild(svgDoc.getElementById(id + '_UnitCount_mov'));
            svgDoc.getElementById("unitAnimations").removeChild(svgDoc.getElementById(id + '_Unit_mov'));
        } else {
            yPositionText = yPositionText + 40 * gradient;
            yPositionImg = yPositionImg + 40 * gradient;
            svgDoc.getElementById(id + "_UnitCount_mov").setAttribute("y", yPositionText);
            svgDoc.getElementById(id + "_Unit_mov").setAttribute("y", yPositionImg);
            setTimeout(function() {moveNewMapOwnerComplete(id, yPositionText, yPositionImg, gradient)}, 50);
        }
    };
    
    var moveNewMapOwner = function(id, yPositionText, yPositionImg){
        if(yPositionText > parseInt(svgDoc.getElementById(id + "_UnitCount").getAttribute("y"))){
            Core.svgHandler.changeLandVisible(id);
            svgDoc.getElementById("unitAnimations").removeChild(svgDoc.getElementById(id + '_UnitCount_mov'));
            svgDoc.getElementById("unitAnimations").removeChild(svgDoc.getElementById(id + '_Unit_mov'));
        } else {
            yPositionText = yPositionText + 40;
            yPositionImg = yPositionImg + 40;
            svgDoc.getElementById(id + "_UnitCount_mov").setAttribute("y", yPositionText);
            svgDoc.getElementById(id + "_Unit_mov").setAttribute("y", yPositionImg);
            setTimeout(function() {moveNewMapOwner(id, yPositionText, yPositionImg)}, 50);
        }
    };
    
    this.doMovementAnimation = function(source, target, amount){
        var route = null;
        var countryHeight, countryWidth, width, height, xPosition, yPosition;
        var mapUnitID = svgDoc.getElementById("mapUnit");
        var mapUnitCountCountry = svgDoc.getElementById("unitCountCountry");
        var rect = svgDoc.getElementById(source);
        var rectID = rect.getAttribute("id");
        
        if(rectID != ""){
            countryHeight = parseInt(rect.getAttribute("height"));
            countryWidth = parseInt(rect.getAttribute("width"));
            if(countryWidth < 800){
                width = countryWidth * 0.677;
                height = countryWidth * 0.9;
            }else{
                height = 800;
                if(countryHeight < height){
                    width = countryHeight * 0.8;
                    height = countryHeight * 0.6;
                } else{
                    width = height * 0.75;
                }
            }
            if(height == 800 && !("B3B2C3C4P7P13".indexOf(rectID) > -1)){
                xPosition = (parseInt(rect.getAttribute("x")) + countryWidth/2) - (width / 2) - 150;
            }else{
                xPosition = (parseInt(rect.getAttribute("x")) + countryWidth/2) - (width / 2);
            }

            yPosition = (parseInt(rect.getAttribute("y")) + countryHeight/2) - (height / 2);
            mapUnitID.innerHTML = mapUnitID.innerHTML + '<image id="' + 'Runner_Unit_mov" x="' + xPosition + '" y="' + yPosition + '" width="' + width + '" height="' + height + '" xlink:href="' + svgDoc.getElementById(source+"_Unit").getAttribute('xlink:href') + '" />';
            
            if(countryWidth > 1234){
                xPosition = xPosition + width * 1.4 ;
                yPosition = yPosition + height/2 + 130;
            } else {
                xPosition = xPosition + width/2 ;
                yPosition = yPosition + height * 1.5;
            }

            mapUnitCountCountry.innerHTML = mapUnitCountCountry.innerHTML + '<text id="' + 'Runner_UnitCount_mov" x="' + xPosition + '" y="' + yPosition + '" class="fil6 fnt2" text-anchor="middle">' + amount + '</text>';

            route = calcUnitRunWay(source, target);
            console.log("ErgebnisRoute: " + route.toString());
            this.nextUnitTarget(route, 0);
        }
    };    
    this.nextUnitTarget = function (route, pos){
        ++pos;
        if(pos < route.length){
            console.log("Animation @: " + route[pos]);
            
            var imgMov = svgDoc.getElementById('Runner_Unit_mov');
            var imgAMov = svgDoc.getElementById('Runner_UnitCount_mov');            
            var imgTarget = svgDoc.getElementById(svgDoc.getElementById(route[pos]).getAttribute("id") + '_Unit');
            var imgATarget = svgDoc.getElementById(svgDoc.getElementById(route[pos]).getAttribute("id") + '_UnitCount');

            var movementData = new Array (parseInt(imgMov.getAttribute("x")), parseInt(imgMov.getAttribute("y")), parseInt(imgTarget.getAttribute("x")), parseInt(imgTarget.getAttribute("y")));
            var movementAData = new Array (parseInt(imgAMov.getAttribute("x")),parseInt(imgAMov.getAttribute("y")), parseInt(imgATarget.getAttribute("x")), parseInt(imgATarget.getAttribute("y")));
            var xDirection = "-";
            var yDirection = "-";
            if (movementData[0] < movementData[2])
                xDirection = "+";
            if (movementData[1] < movementData[3])
                yDirection = "+"; 

            this.moveUnitToTarget(movementData, movementAData, imgMov, imgAMov, xDirection, yDirection, route, pos);
         }
         else{
            var imgMov = svgDoc.getElementById('Runner_Unit_mov');
            var imgAMov = svgDoc.getElementById('Runner_UnitCount_mov'); 
            
            this.killDomElement(imgMov);
            this.killDomElement(imgAMov);
        }
    };
    
    this.moveUnitToTarget = function(movementData, movementAData, imgMov, imgAMov, xDirection, yDirection, route, pos){
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
                    movementData[0] += 15; 
                    imgMov.setAttribute("x", movementData[0]);
                }
                if (movementAData[0] < movementAData[2]){
                    movementAData[0] += 15; 
                    imgAMov.setAttribute("x", movementAData[0]);       
                 }
            }
            else{
                if (movementData[0] > movementData[2]){
                    movementData[0] -= 15; 
                    imgMov.setAttribute("x", movementData[0]);
                }
                if (movementAData[0] > movementAData[2]){
                    movementAData[0] -= 15;
                    imgAMov.setAttribute("x", movementAData[0]);
                }
            }
            if(yDirection == "+"){
                if (movementData[1] < movementData[3]){
                    movementData[1] += 15; 
                    imgMov.setAttribute("y", movementData[1]);
                }
                if (movementAData[1] < movementAData[3]){
                    movementAData[1] += 15;
                    imgAMov.setAttribute("y", movementAData[1]);
                }
            }
            else{
                if (movementData[1] > movementData[3]){
                    movementData[1] -= 15; 
                    imgMov.setAttribute("y", movementData[1]);
                }
                if (movementAData[1] > movementAData[3]){
                    movementAData[1] -= 15; 
                    imgAMov.setAttribute("y", movementAData[1]);
                }
            }
            setTimeout(this.moveUnitToTarget(movementData, movementAData, imgMov, imgAMov, xDirection, yDirection, route, pos), 100);
        } 
        else{
            this.nextUnitTarget(route, pos);
        }
    };
    
     
    var calcUnitRunWay = function(source, target){        
        var route = new Array();
        if($.inArray(target, Core.svgHandler.getLandNeighborsFiltered(source, true)) != -1){   //check direct neighbors
            route.push(target);
        }
        else{                                                                    //calc complex pathfinding route
            route = findRoute(source, target, route);    
            
            var index = route.indexOf("finish"); 
            if (index > -1){
                while(route.length > index)
                    route.splice(route.length-1, 1);
            }
        }
        return route;
    };
    
    var findRoute = function(source, target, route){
        if($.inArray("finish", route) != -1)
            return route;
        var sourceN = Core.svgHandler.getLandNeighborsFiltered(source, true);
        if(source == target){
            route.push("finish");
            return route;
        }      
        if($.inArray(target, route) != -1)
            return route;
        if(sourceN.length == 0 || (sourceN.length == 1 && $.inArray(sourceN[0], route) != -1)){
            route.splice(route.length-1, 1);
            return route;
        }
        for(var i = 0; i < sourceN.length; i++){
            if($.inArray(sourceN[i], route) == -1){
                route.push(sourceN[i]);
                console.log("add "+sourceN[i]+" to route: "+route);
                route = findRoute (sourceN[i], target, route);
            }
        }
        return route;
    };
    
    this.killDomElement = function(element) {  // BE CARFEUL THIS FUNCTION IS EVIL IT KILLS THE POOR DOM ELEMENTS !!! .... R.I.P. ....
        if (element) {
            var padre = element.parentNode;
            if (padre) padre.removeChild(element);
        }
    };
}