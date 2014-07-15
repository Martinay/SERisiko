// ---------------------- #

/**
 *
 * @author Alexander Santana Losada
 */

function SvgFunctions(document){
    //#Public Vars    

    //#Private Vars
    var svgDoc = null;
    var root = document;
    var colorArr = ["/img/player_img/player_blue.png", "/img/player_img/player_green.png", "/img/player_img/player_purple.png", "/img/player_img/player_yellow.png", "/img/player_img/player_black.png", "/img/player_img/player_gray.png", "/img/player_img/player_red.png"];
    var playerColorHREF = {};
    
    //# Public Methods
    this.init = function(doc){       
        svgDoc = doc;
    };
    
    this.getLandOwner = function(landId){
        return parseInt(svgDoc.getElementById(landId).getAttribute("owner"));  
    };
    
    this.setNewLandOwner = function(landId, playerId){
        svgDoc.getElementById(landId).setAttribute("owner", playerId); 
    };
    
    this.changeLandVisible = function(landId){
        if(svgDoc.getElementById(landId + "_Unit") !== null || svgDoc.getElementById(landId + "_Unit") !== undefined){
            svgDoc.getElementById(landId + "_Unit").setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", playerColorHREF['"' + parseInt(svgDoc.getElementById(landId).getAttribute("owner")) + '"']);
        }
        if(svgDoc.getElementById(landId + "_UnitCount") !== null || svgDoc.getElementById(landId + "_Unit") !== undefined){
            svgDoc.getElementById(landId + "_UnitCount").innerHTML = parseInt(svgDoc.getElementById(landId).getAttribute("unitcount"));
        }
    };
    
    this.setLandComplete = function(landId, playerId, count){
        this.setNewLandOwner(landId, playerId);
        this.setLandUnitcount(landId, count);
    };
    
    this.setLandUnitcount = function(landId, count){
        svgDoc.getElementById(landId).setAttribute("unitcount", count);
    };
    
    this.getLandUnitcount = function(landId){
        return parseInt(svgDoc.getElementById(landId).getAttribute("unitcount"));  
    };
 
    var getLandNeighbors = function(id){
        return svgDoc.getElementById(id).getAttribute("neighbor").split(",");
    };
    
    this.getLandNeighborsFiltered = function(id, own){
        var neighborLands = getLandNeighbors(id);
        var neighborLandsToReturn = new Array();
        for (var i = 0; i < neighborLands.length; i++){
            if(own === true && svgDoc.getElementById(neighborLands[i]).getAttribute("owner") ===  svgDoc.getElementById(id).getAttribute("owner")){
                neighborLandsToReturn.push(neighborLands[i]);
            } 
            if (own === false && svgDoc.getElementById(neighborLands[i]).getAttribute("owner") !== svgDoc.getElementById(id).getAttribute("owner")) {
                neighborLandsToReturn.push(neighborLands[i]);
            }
        }
        return neighborLandsToReturn;
    };
    
    this.identifySource = function(id){
        this.setRectsOnClickNull();
        var theRect = svgDoc.getElementById(id);
        var neighborLands = null;
        theRect.onmouseover = new Function("Core.svgHandler.setOpacityOnRect(this.id, 0.3, 'pointer');");
        theRect.onmouseout = new Function("Core.svgHandler.setOpacityOnRect(this.id, 0.3, 'default');");
        svgDoc.getElementById(id + "_back").setAttribute('opacity','0.3');
        if(Core.gameSteps.getGameStep() === Core.gameSteps.state.ATTACK){
            neighborLands = this.getLandNeighborsFiltered(id, false);
            for (var i = 0; i < neighborLands.length; i++) {
                theRect = svgDoc.getElementById(neighborLands[i]);
                if(theRect.getAttribute("owner") !==  Core.getPlayerId()){
                    theRect.onmouseover = new Function("Core.svgHandler.setOpacityOnRect(this.id, 0.5, 'pointer');");
                    theRect.onmouseout = new Function("Core.svgHandler.setOpacityOnRect(this.id, 0.75, 'default');");
                    theRect.onclick = new Function("Core.svgHandler.identifyDestination(this.id, '" + id + "' );");
                    svgDoc.getElementById(theRect.getAttribute("id") + "_back").setAttribute('opacity','0.75');
                }
            }
            $( "#bottom_overlay" ).slideDown( "slow");
            root.getElementById("bottom_overlay").innerHTML = "\
                    <button name='clearAttackBottomDisplay' onClick='Core.attackHandler.clearAttackBottomDisplay();' style='margin: 22px 398px;'>Auswahl aufheben</button>";
        } else {
            neighborLands = this.getLandNeighborsFiltered(id, true); 
            var newNeighorLands = null;
            var doneCountrys = new Array();
            doneCountrys.push(id);
            var goOn = true;
            while(goOn === true){
                goOn = false;
                newNeighorLands = new Array();
                for (var i = 0; i < neighborLands.length; i++) {
                    theRect = svgDoc.getElementById(neighborLands[i]);
                    if(doneCountrys.indexOf(theRect.getAttribute('id')) === -1){
                        doneCountrys.push(theRect.getAttribute('id'));
                    }
                    theRect.onmouseover = new Function("Core.svgHandler.setOpacityOnRect(this.id, 0.5, 'pointer');");
                    theRect.onmouseout = new Function("Core.svgHandler.setOpacityOnRect(this.id, 0.75, 'default');");
                    theRect.onclick = new Function("Core.svgHandler.identifyDestination(this.id, '" + id + "' );");
                    svgDoc.getElementById(theRect.getAttribute("id") + "_back").setAttribute('opacity','0.75');
                    newNeighorLands = newNeighorLands.concat(theRect.getAttribute("neighbor").split(","));
                    goOn = true;
                }
                neighborLands = arraySchnittmengeDelete(newNeighorLands, doneCountrys);
            }
            $( "#bottom_overlay" ).slideDown( "slow");
            root.getElementById("bottom_overlay").innerHTML = "\
                    <button name='clearUnitMoveDisplay' onClick='Core.unitMoveHandler.clearUnitMoveDisplay();' style='margin: 22px 398px;'>Auswahl aufheben</button>";
        }
    };
    
    this.identifyDestination = function(id, attacker){
        this.setRectsOnClickNull();
        svgDoc.getElementById(attacker + "_back").setAttribute('opacity','0.5');
        svgDoc.getElementById(id + "_back").setAttribute('opacity','0.5');
        if(Core.gameSteps.getGameStep() === Core.gameSteps.state.ATTACK){
            Core.attackHandler.selectAmountUnit(attacker, id);
        } else {
            Core.unitMoveHandler.selectCountMoveUnits(attacker, id);
        }
        
    };
    
    this.setRectsOnClickNull = function(){
        var rects = svgDoc.getElementsByTagName("rect");
        [].slice.call(rects).forEach(function(rect){
            rect.onmouseover = new Function("Core.svgHandler.setOpacityOnRect(this.id, 1, 'default');");;
            rect.onmouseout = new Function("Core.svgHandler.setOpacityOnRect(this.id, 1, 'default');");;
            rect.onclick = "";
            if(rect.getAttribute("id").indexOf("_back") !== -1){
                svgDoc.getElementById(rect.getAttribute("id")).setAttribute('opacity','1');
            }
        });
    };
    
    this.refreshOwnerRights = function (){
        if(Core.gameSteps.getGameStep() === Core.gameSteps.state.ATTACK || Core.gameSteps.getGameStep() === Core.gameSteps.state.UNITMOVEMENT){
            var rects = svgDoc.getElementsByTagName("rect");
            [].slice.call(rects).forEach(function(rect){
                if(parseInt(rect.getAttribute("owner")) === Core.getPlayerId() && rect.getAttribute("unitcount") > 1){
                    rect.onmouseover = new Function("Core.svgHandler.setOpacityOnRect(this.id, 0.75, 'pointer');");
                    rect.onmouseout = new Function("Core.svgHandler.setOpacityOnRect(this.id, 1, 'default');");
                    rect.onclick = new Function("Core.svgHandler.identifySource(this.id);");
                }
            });
        }
    };
    
    this.refreshOwnerRightsForUnitPlace = function (value){
        if(Core.gameSteps.getGameStep() === Core.gameSteps.state.UNITPLACEMENT || Core.gameSteps.getGameStep() === Core.gameSteps.state.FIRSTUNITPLACEMENT){
            var rects = svgDoc.getElementsByTagName("rect");
            [].slice.call(rects).forEach(function(rect){
                if(parseInt(rect.getAttribute("owner")) === Core.getPlayerId()){
                    rect.onmouseover = new Function("Core.svgHandler.setOpacityOnRect(this.id, 0.75, 'pointer');");
                    rect.onmouseout = new Function("Core.svgHandler.setOpacityOnRect(this.id, 1, 'default');");
                    rect.onclick = new Function("Core.unitPlacementHandler.unitPlacement(this.id, \""+value+"\");");
                }
            });
        }
    };
    
    this.setOpacityOnRect = function (id, opacity, cursor){
        var rect = svgDoc.getElementById(id + "_back");
        rect.setAttribute('opacity', opacity);
        rect = svgDoc.getElementById(id);
        rect.style = 'cursor: ' + cursor;
    };
    
    this.initUnitOnMap = function(){
        var rects = svgDoc.getElementsByTagName("rect");
        var xPosition = 0;
        var yPosition = 0;
        var height = 0;
        var width = 0;
        var countryHeight = 0;
        var countryWidth = 0;
        var rectID = "";
        var mapUnitID = svgDoc.getElementById("mapUnit");
        var mapUnitCountCountry = svgDoc.getElementById("unitCountCountry");
            
        initPlayerColor();
        
        [].slice.call(rects).forEach(function(rect){
            rectID = rect.getAttribute("id");
            
            if(rectID !== "" && rectID.indexOf("_back") === -1){
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
                if(height === 800 && !("B3B2C3C4P7P13".indexOf(rectID) > -1)){
                    xPosition = (parseInt(rect.getAttribute("x")) + countryWidth/2) - (width / 2) - 150;
                }else{
                    xPosition = (parseInt(rect.getAttribute("x")) + countryWidth/2) - (width / 2);
                }
                
                yPosition = (parseInt(rect.getAttribute("y")) + countryHeight/2) - (height / 2);
                
                console.log(mapUnitID.innerHTML);
                
                var xmlns = "http://www.w3.org/2000/svg";
                var elem = document.createElementNS(null, "image");
                
                elem.setAttributeNS(null, "x", xPosition);
                elem.setAttributeNS(null, "y", yPosition);
                elem.setAttributeNS(null, "width", width);
                elem.setAttributeNS(null, "height", height);
                elem.setAttributeNS(null, "xlink:href", "/img/player_img/player_red.png");
                elem.setAttributeNS(null, "id", rectID + '_Unit');
                
                mapUnitID.documentElement.appendChild(elem);
                
                if(mapUnitID.innerHTML === undefined || mapUnitID.innerHTML === ""){
                   // mapUnitID.innerHTML = '<image id="' + rectID + '_Unit" x="' +  + '" y="' + yPosition + '" width="' + width + '" height="' + height + '" xlink:href="/img/player_img/player_red.png" xmlns:xlink="http://www.w3.org/1999/xlink"/>';
                } else {
                   // mapUnitID.innerHTML = mapUnitID.innerHTML + '<image id="' + rectID + '_Unit" x="' + xPosition + '" y="' + yPosition + '" width="' + width + '" height="' + height + '" xlink:href="" />';
                }
                
                if(countryWidth > 1234){
                    xPosition = xPosition + width * 1.4 ;
                    yPosition = yPosition + height/2 + 130;
                } else {
                    xPosition = xPosition + width/2 ;
                    yPosition = yPosition + height * 1.5;
                }
                
                if(mapUnitCountCountry.innerHTML === undefined || mapUnitCountCountry.innerHTML === ""){
                    mapUnitCountCountry.innerHTML = '<text id="' + rectID + '_UnitCount" x="' + xPosition + '" y="' + yPosition + '" class="fil6 fnt2" text-anchor="middle"></text>';
                } else {
                    mapUnitCountCountry.innerHTML = mapUnitCountCountry.innerHTML + '<text id="' + rectID + '_UnitCount" x="' + xPosition + '" y="' + yPosition + '" class="fil6 fnt2" text-anchor="middle"></text>';
                }
            }
        });
    };
    
    //Private Methods
    var arraySchnittmengeDelete = function(array, arrayDelete){
        for(var i = 0; i < arrayDelete.length; i++){
            while(array.indexOf(arrayDelete[i]) !== -1){
                array.splice(array.indexOf(arrayDelete[i]), 1);
            }
        }
        return array;
    };
    
    var initPlayerColor = function(){
        var players = Core.playerList.getPlayers();
        for(var i = 0; i < players.length; i++){
            playerColorHREF['"' + players[i].getPlayerId() + '"'] = colorArr[i];
        }
        playerColorHREF["undefined"] = colorArr[6];
    };
}