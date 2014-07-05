// ---------------------- #

/**
 *
 * @author Alexander Santana Losada
 */

function SvgFunctions(document){
    //#Public Vars    
    
    //#Private Vars
    var svgDoc = null;
    var neighborLands = null;
    var root = document;
    var i = 0;
    var counter = 0;
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
        if(svgDoc.getElementById(landId + "_Unit") != null){
            svgDoc.getElementById(landId + "_Unit").setAttribute("xlink:href", playerColorHREF['"' + playerId + '"']);
        }
    };
    
    this.setLandComplete = function(landId, playerId, count){
        this.setNewLandOwner(landId, playerId);
        this.setLandUnitcount(landId, count);
    }
    
    this.setLandUnitcount = function(landId, count){
        svgDoc.getElementById(landId).setAttribute("unitcount", count);
        if(svgDoc.getElementById(landId + "_UnitCount") != null){
            svgDoc.getElementById(landId + "_UnitCount").innerHTML = count;
        }
    };
    
    this.getLandUnitcount = function(landId){
        return parseInt(svgDoc.getElementById(landId).getAttribute("unitcount"));  
    };

    this.identifySource = function(id){
        this.setRectsOnClickNull();
        var theRect = svgDoc.getElementById(id);
        neighborLands = theRect.getAttribute("neighbor").split(",");
        theRect = svgDoc.getElementById(id + "_back");
        theRect.setAttribute('opacity','0.3');
        if(Core.gameSteps.getGameStep() == Core.gameSteps.state.ATTACK){
            for (var i = 0; i < neighborLands.length; i++) {
                theRect = svgDoc.getElementById(neighborLands[i]);
                if(theRect.getAttribute("owner") !=  Core.getPlayerId()){
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
            var newNeighorLands = null;
            var doneCountrys = new Array();
            doneCountrys.push(id);
            var goOn = true;
            while(goOn == true){
                goOn = false;
                newNeighorLands = new Array();
                for (var i = 0; i < neighborLands.length; i++) {
                    theRect = svgDoc.getElementById(neighborLands[i]);
                    if(doneCountrys.indexOf(theRect.getAttribute('id')) == -1){
                        doneCountrys.push(theRect.getAttribute('id'));
                    }
                    if(theRect.getAttribute("owner") ==  Core.getPlayerId()){
                        theRect.onmouseover = new Function("Core.svgHandler.setOpacityOnRect(this.id, 0.5, 'pointer');");
                        theRect.onmouseout = new Function("Core.svgHandler.setOpacityOnRect(this.id, 0.75, 'default');");
                        theRect.onclick = new Function("Core.svgHandler.identifyDestination(this.id, '" + id + "' );");
                        svgDoc.getElementById(theRect.getAttribute("id") + "_back").setAttribute('opacity','0.75');
                        newNeighorLands = newNeighorLands.concat(theRect.getAttribute("neighbor").split(","));
                        goOn = true;
                    }
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
        var theRect = svgDoc.getElementById(attacker + "_back");
        theRect.setAttribute('opacity','0.5');
        var theRect = svgDoc.getElementById(id + "_back");
        theRect.setAttribute('opacity','0.5');
        if(Core.gameSteps.getGameStep() == Core.gameSteps.state.ATTACK){
            for (var i = 0; i < neighborLands.length; i++) {
                if(id != neighborLands[i]){
                    theRect = svgDoc.getElementById(neighborLands[i] + "_back");
                    theRect.onmouseout = new Function("Core.svgHandler.setOpacityOnRect(this.id, 1, 'default');");
                    theRect.setAttribute('opacity','1');
                }
            }
            Core.attackHandler.selectAmountUnit(attacker, id);
        } else {
            Core.unitMoveHandler.selectCountMoveUnits(attacker, id);
        }
        
    };
    
    this.setRectsOnClickNull = function(){
        var rects = svgDoc.getElementsByTagName("rect");
        [].slice.call(rects).forEach(function(rect){
            rect.onmouseover = "";
            rect.onmouseout = "";
            rect.onclick = "";
            if(rect.getAttribute("id").indexOf("_back") != -1){
                svgDoc.getElementById(rect.getAttribute("id")).setAttribute('opacity','1');
                svgDoc.getElementById(rect.getAttribute("id")).style='cursor: default';
            }
        });
    }
    
    this.refreshOwnerRights = function (){
        if(Core.gameSteps.getGameStep() == Core.gameSteps.state.ATTACK || Core.gameSteps.getGameStep() == Core.gameSteps.state.UNITMOVEMENT){
            var rects = svgDoc.getElementsByTagName("rect");
            [].slice.call(rects).forEach(function(rect){
                if(rect.getAttribute("owner") == Core.getPlayerId() && rect.getAttribute("unitcount") > 2){
                    rect.onmouseover = new Function("Core.svgHandler.setOpacityOnRect(this.id, 0.75, 'pointer');");
                    rect.onmouseout = new Function("Core.svgHandler.setOpacityOnRect(this.id, 1, 'default');");
                    rect.onclick = new Function("Core.svgHandler.identifySource(this.id);");
                }
            });
        }
    };
    
    this.refreshOwnerRightsForUnitPlace = function (value){
        if(Core.gameSteps.getGameStep() == Core.gameSteps.state.UNITPLACEMENT || Core.gameSteps.getGameStep() == Core.gameSteps.state.FIRSTUNITPLACEMENT){
            var rects = svgDoc.getElementsByTagName("rect");
            [].slice.call(rects).forEach(function(rect){
                if(rect.getAttribute("owner") == Core.getPlayerId()){
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
    
    this.drawRotatePaperOnCanvas = function(id, rotate){
        if (i < rotate){
            var canvas = root.getElementById('canvas_' + id);
            var img = new Image();
            img.onload = function(){
                if(canvas != null && canvas.getContext){
                    var context = canvas.getContext('2d');
                    context.beginPath();    
                    context.rect(0, 0, 150, 150);    
                    context.fillStyle = 'rgba(0, 0, 0, .9)';
                    context.fill();
                    context.translate(75, 75);
                    context.rotate(20 * Math.PI / 180);
                    context.translate(-75, -75);
                    context.drawImage(img, 0, 0, 150, 150);
                }
            };
            img.src = '/img/paper.png';
            i++;
            setTimeout(function(){Core.svgHandler.drawRotatePaperOnCanvas(id, rotate);},50);
       }else{
            counter++;
            if(root.getElementById("startAttack") != null && Core.gameSteps.getGameStep() == Core.gameSteps.state.ATTACK){
                root.getElementById("startAttack").disabled = false;
            }
            drawDigitOnCanvas(id);
            if(counter == (rotate/18)){
                counter = 0;
                i = 0;
            }
       }
    };
    
        this.initUnitOnMap = function(){
        var rects = svgDoc.getElementsByTagName("rect");
        var xPosition = 0;
        var yPosition = 0;
        var height = 0;
        var width = 0;
        var countryHeight = 0;
        var countryWidth = 0;
        var mapUnitID = svgDoc.getElementById("MapUnit");
        var mapUnitCountCountry = svgDoc.getElementById("UnitCountCountry");
        var rectID = 
                
        initPlayerColor();
        
        [].slice.call(rects).forEach(function(rect){
            rectID = rect.getAttribute("id");
            
            if(rectID != "" && rectID.indexOf("_back") == -1){
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
                mapUnitID.innerHTML = mapUnitID.innerHTML + '<image id="' + rectID + '_Unit" x="' + xPosition + '" y="' + yPosition + '" width="' + width + '" height="' + height + '" xlink:href="" />';
                
                if(countryWidth > 1234){
                    xPosition = xPosition + width * 1.4 ;
                    yPosition = yPosition + height/2 + 130;
                } else {
                    xPosition = xPosition + width/2 ;
                    yPosition = yPosition + height * 1.5;
                }
               
                mapUnitCountCountry.innerHTML = mapUnitCountCountry.innerHTML + '<text id="' + rectID + '_UnitCount" x="' + xPosition + '" y="' + yPosition + '" class="fil6 fnt2" text-anchor="middle"></text>';
            }
        });
    };
    
    //Private Methods
    
    var arraySchnittmengeDelete = function(array, arrayDelete){
        for(i = 0; i < arrayDelete.length; i++){
            while(array.indexOf(arrayDelete[i]) != -1){
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
    
    var drawDigitOnCanvas = function(id){
        var count = Core.combatHandler.getDice(id);
        count = 7-count;
        var canvas = root.getElementById('canvas_' + id);
        if(canvas != null && canvas.getContext){
            var context = canvas.getContext('2d');
            context.font = '40pt Arial';
            context.textAlign = 'center';
            context.fillStyle = 'red';
            context.fillText(count, 75, 90);
        }
    };
}