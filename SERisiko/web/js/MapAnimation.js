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
        if(textMov !== null && textMov !== undefined){
            var movementData = new Array (parseInt(textMov.getAttribute("x")), parseInt(textMov.getAttribute("y")));

            var tempCount = parseInt(count) - parseInt(svgDoc.getElementById(id).getAttribute("unitcount"));
            var fillstyle = "fil9";
            var vorzeichen = "+ ";

            if(tempCount < 0){
                fillstyle = "fil8";
                vorzeichen = "- ";
            } 
            else {
                if(movementData[1]-2000 < 0)
                    movementData[1] = 0;
                else
                    movementData[1] = movementData[1]-2000;
            }

            var mapUnitAnimations = svgDoc.getElementById("unitAnimations");
            var xmlns = "http://www.w3.org/2000/svg";
            
            var text = root.createElementNS(xmlns, "text");
                
            text.setAttribute("id", id + "_UnitCount_mov");
            text.setAttribute("x", movementData[0]);
            text.setAttribute("y", movementData[1]);
            text.setAttribute("class", fillstyle + " fnt4");
            text.setAttribute("text-anchor", "middle");
            var textNode = root.createTextNode(vorzeichen + tempCount);
            text.appendChild(textNode);
            
            mapUnitAnimations.appendChild(text);
           
            Core.svgHandler.setLandUnitcount(id, count);
            if(tempCount < 0)
                setTimeout(function() {animateUnitRemove(id, movementData[1]);}, 50);
            else
                setTimeout(function() {animateUnitAdd(id, movementData[1]);}, 50);
        }
    };

    var animateUnitAdd = function(id, yPosition){
        if(yPosition > parseInt(svgDoc.getElementById(id + "_UnitCount").getAttribute("y"))){
            Core.svgHandler.changeLandVisible(id);
            svgDoc.getElementById("unitAnimations").removeChild(svgDoc.getElementById(id + '_UnitCount_mov'));
        } else {
            yPosition = yPosition + 40;
            svgDoc.getElementById(id + "_UnitCount_mov").setAttribute("y", yPosition);
            setTimeout(function() {animateUnitAdd(id, yPosition);}, 50);
        }
    };
    
    var animateUnitRemove = function(id, yPosition){
        if(yPosition < parseInt(svgDoc.getElementById(id + "_UnitCount").getAttribute("y")) - 2000){
            Core.svgHandler.changeLandVisible(id);
            svgDoc.getElementById("unitAnimations").removeChild(svgDoc.getElementById(id + '_UnitCount_mov'));
        } else {
            yPosition = yPosition - 40;
            svgDoc.getElementById(id + "_UnitCount_mov").setAttribute("y", yPosition);
            setTimeout(function() {animateUnitRemove(id, yPosition);}, 50);
        }
    };
    
    this.doMovementAnimation = function(source, target, amount){
        var route = null;
        var mapUnitAnimations = svgDoc.getElementById("unitAnimations");
        
        var sourceUnit = svgDoc.getElementById(source + "_Unit");
        var sourceCountText = svgDoc.getElementById(source + "_UnitCount");
        if(sourceUnit !== null && sourceUnit !== undefined && sourceCountText !== null && sourceUnit !== sourceCountText){
            var xmlns = "http://www.w3.org/2000/svg";
            var image = root.createElementNS(xmlns, "image");
                
            image.setAttribute("id", "Runner_Unit_mov");
            image.setAttribute("x", sourceUnit.getAttribute("x"));
            image.setAttribute("y", sourceUnit.getAttribute("y"));
            image.setAttribute("width", 800);
            image.setAttribute("height", 600);
            image.setAttributeNS("http://www.w3.org/1999/xlink", "href", sourceUnit.getAttribute('href'));
            
            var text = root.createElementNS(xmlns, "text");
                
            text.setAttribute("id", 'Runner_UnitCount_mov');
            text.setAttribute("x", sourceCountText.getAttribute("x"));
            text.setAttribute("y", sourceCountText.getAttribute("y"));
            text.setAttribute("class", "fil9 fnt4");
            text.setAttribute("text-anchor", "middle");
            var textNode = root.createTextNode(amount);
            text.appendChild(textNode);
            
            mapUnitAnimations.appendChild(image);
            mapUnitAnimations.appendChild(text);

            //route = calcUnitRunWay(source, target);
            route = new Array();
            route.push(target);
            console.log("ErgebnisRoute: " + route.toString());
            this.nextUnitTarget(route, 0);
        }
    }; 
    
    this.nextUnitTarget = function (route, pos){
        if(pos < route.length){
            console.log("Animation @: " + route[pos]);
            
            var imageMov =  svgDoc.getElementById('Runner_Unit_mov');
            var textMov = svgDoc.getElementById('Runner_UnitCount_mov'); 
            
            var movementDataTextSource = new Array (parseInt(textMov.getAttribute("x")), (14605 - parseInt(textMov.getAttribute("y"))));
            var movementDataImgSource = new Array (parseInt(imageMov.getAttribute("x")), (14605 - parseInt(imageMov.getAttribute("y"))), imageMov.getAttribute("xlink:href"));
            
            imageMov = svgDoc.getElementById(route[pos] + '_Unit');
            var movementDataImgDestination = new Array (parseInt(imageMov.getAttribute("x")), (14605 - parseInt(imageMov.getAttribute("y"))));
            var gradient = "";
            var b = 0;
            if(movementDataImgSource[0] - movementDataImgDestination[0] === 0 || movementDataImgSource[1] - movementDataImgDestination[1] === 0){
                if(movementDataImgSource[0] - movementDataImgDestination[0] === 0){
                    gradient = "y";
                    b = movementDataImgSource[1] - movementDataImgDestination[1] > 0?"-":"+";
                } 
                else {
                    gradient = "x";
                    b = movementDataImgSource[0] - movementDataImgDestination[0] > 0?"-":"+";
                }
            } 
            else {
                gradient = (movementDataImgDestination[1] - movementDataImgSource[1])/(movementDataImgDestination[0] - movementDataImgSource[0]);
                var imgY1 = movementDataImgSource[1];
                var textY1 = movementDataTextSource[1];
                var imgX1 = movementDataImgSource[0];
                var textX1 = movementDataTextSource[0];
                var xRichtung = movementDataImgSource[0] - movementDataImgDestination[0] > 0 ? "-":"+";
            }
            switch(gradient){
                case "x":
                    this.moveNewMapOwnerCompleteX(movementDataTextSource[0], movementDataTextSource[1], movementDataImgSource[0], movementDataImgSource[1], gradient, b, route, pos);
                    break;
                case "y":
                    this.moveNewMapOwnerCompleteY(movementDataTextSource[0], movementDataTextSource[1], movementDataImgSource[0], movementDataImgSource[1], gradient, b, route, pos); 
                    break;
                default:
                    this.moveNewMapOwnerComplete(movementDataTextSource[0], movementDataTextSource[1], movementDataImgSource[0], movementDataImgSource[1], gradient, textX1, textY1, imgX1, imgY1, route, pos, xRichtung);
                    break;
            }
        } else {
            svgDoc.getElementById("unitAnimations").removeChild(svgDoc.getElementById('Runner_Unit_mov'));
            svgDoc.getElementById("unitAnimations").removeChild(svgDoc.getElementById('Runner_UnitCount_mov'));
            
        }
    };
    
    this.moveNewMapOwnerComplete = function(xPositionText, yPositionText, xPositionImg, yPositionImg, gradient, textX1, textY1, imgX1, imgY1, route, pos, xRichtung){
        var animate = true;    
        if(xRichtung === "+" && xPositionImg > parseInt(svgDoc.getElementById(route[pos] + "_Unit").getAttribute("x"))){
            this.nextUnitTarget(route, ++pos);
            animate = false;
        } 
        if(xRichtung === "-" && xPositionImg < parseInt(svgDoc.getElementById(route[pos] + "_Unit").getAttribute("x"))){
            this.nextUnitTarget(route, ++pos);
            animate = false;
        } 
        if(animate === true){
            if( xRichtung == "+"){
                xPositionText = xPositionText + 40;
                xPositionImg = xPositionImg + 40;
            } else {
                xPositionText = xPositionText - 40; 
                xPositionImg = xPositionImg - 40;
            }
            yPositionText = 14605 - (textY1 + gradient * (xPositionText - textX1));
            yPositionImg = 14605 - (imgY1 + gradient * (xPositionImg - imgX1));
            svgDoc.getElementById("Runner_UnitCount_mov").setAttribute("y", yPositionText);
            svgDoc.getElementById("Runner_UnitCount_mov").setAttribute("x", xPositionText);
            svgDoc.getElementById("Runner_Unit_mov").setAttribute("y", yPositionImg);
            svgDoc.getElementById("Runner_Unit_mov").setAttribute("x", xPositionImg);
            setTimeout(function() {Core.mapAnimationHandler.moveNewMapOwnerComplete(xPositionText, yPositionText, xPositionImg, yPositionImg, gradient, textX1, textY1, imgX1, imgY1, route, pos, xRichtung);}, 50);
        }    
    };
    
    this.moveNewMapOwnerCompleteX = function(xPositionText, yPositionText, xPositionImg, yPositionImg, gradient, b, route, pos){
        if(b === "-" && xPositionText < parseInt(svgDoc.getElementById(route[pos] + "_UnitCount").getAttribute("x"))){
            this.nextUnitTarget(route, ++pos);
        } 
        else if(b === "+" && xPositionText > parseInt(svgDoc.getElementById(route[pos] + "_UnitCount").getAttribute("x"))){
            this.nextUnitTarget(route, pos++);
        } 
        else {
            if(b === "-"){
                xPositionText = xPositionText - 40;
                xPositionImg = xPositionImg - 40;
            } else {
                xPositionText = xPositionText + 40;
                xPositionImg = xPositionImg + 40;
            }
            svgDoc.getElementById("Runner_UnitCount_mov").setAttribute("x", xPositionText);
            svgDoc.getElementById("Runner_Unit_mov").setAttribute("x", xPositionImg);
            setTimeout(function() {Core.mapAnimationHandler.moveNewMapOwnerCompleteX(xPositionText, yPositionText, xPositionImg, yPositionImg, gradient, b, route, pos);}, 50);
        }
    };
    
    this.moveNewMapOwnerCompleteY = function(xPositionText, yPositionText, xPositionImg, yPositionImg, gradient, b, route, pos){
        if(b === "-" && yPositionText < parseInt(svgDoc.getElementById(route[pos] + "_UnitCount").getAttribute("y"))){
            this.nextUnitTarget(route, ++pos);
        } else if(b === "+" && yPositionText > parseInt(svgDoc.getElementById(route[pos] + "_UnitCount").getAttribute("y"))){
            this.nextUnitTarget(route, pos++);
        } else {
            if(b === "-"){
                yPositionText = yPositionText - 40;
                yPositionImg = yPositionImg - 40;
            } else {
                yPositionText = yPositionText + 40;
                yPositionImg = yPositionImg + 40;
            }
            svgDoc.getElementById("Runner_UnitCount_mov").setAttribute("y", yPositionText);
            svgDoc.getElementById("Runner_Unit_mov").setAttribute("y", yPositionImg);
            setTimeout(function() {Core.mapAnimationHandler.moveNewMapOwnerCompleteY(xPositionText, yPositionText, xPositionImg, yPositionImg, gradient, b, route, pos);}, 50);
        }
    };
   
    var calcUnitRunWay = function(source, target){        
        var route = new Array();
        if($.inArray(target, Core.svgHandler.getLandNeighborsFiltered(source, true)) !== -1){   //check direct neighbors
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
    
    //@TODO long and complex route can remain wrong route points cause they get not deleted completly backward recursive
    var findRoute = function(source, target, route){
        if($.inArray("finish", route) !== -1)
            return route;
        var sourceN = Core.svgHandler.getLandNeighborsFiltered(source, true);
        if(source === target){
            route.push("finish");
            return route;
        }      
        if($.inArray(target, route) !== -1)
            return route;
        if(sourceN.length === 0 || (sourceN.length === 1 && $.inArray(sourceN[0], route) !== -1)){
            route.splice(route.length-1, 1);
            return route;
        }
        for(var i = 0; i < sourceN.length; i++){
            if($.inArray(sourceN[i], route) === -1){
                route.push(sourceN[i]);
                console.log("add "+sourceN[i]+" to route: "+route);
                route = findRoute (sourceN[i], target, route);
            }
        }
        return route;
    };
}