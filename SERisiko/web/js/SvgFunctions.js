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
    
    
    
    //# Public Methods
    this.init = function(doc){       
        svgDoc = doc;
        this.refreshOwnerRights();
        initUnitOnMap();
    };

    this.identifyAttacker = function(id){
        this.setRectsOnClickNull();
        var theRect = svgDoc.getElementById(id);
        neighborLands = theRect.getAttribute("neighbor").split(",");
        theRect = svgDoc.getElementById(id + "_back");
        theRect.setAttribute('opacity','0.3');
        for (var i = 0; i < neighborLands.length; i++) {
            theRect = svgDoc.getElementById(neighborLands[i]);
            if(theRect.getAttribute("Owner") !=  Core.getPlayerName()){
                theRect.onmouseover = new Function("Core.svgHandler.setOpacityOnRect(this.id, 0.5, 'pointer');");
                theRect.onmouseout = new Function("Core.svgHandler.setOpacityOnRect(this.id, 0.75, 'default');");
                theRect.onclick = new Function("Core.svgHandler.identifyDestination(this.id, '" + id + "' );");
                theRect.setAttribute('opacity','0.75');
            }
        }
    };
    
    this.identifyDestination = function(id, attacker){
        this.setRectsOnClickNull();
        var theRect = svgDoc.getElementById(attacker + "_back");
        theRect.setAttribute('opacity','0.5');
        var theRect = svgDoc.getElementById(id + "_back");
        theRect.setAttribute('opacity','0.5');
        for (var i = 0; i < neighborLands.length; i++) {
            if(id != neighborLands[i]){
                    theRect = svgDoc.getElementById(neighborLands[i] + "_back");
                    theRect.onmouseout = new Function("Core.svgHandler.setOpacityOnRect(this.id, 1, 'default');");
                    theRect.setAttribute('opacity','1');
                    Core.combatHandler.selectAmountUnit(attacker, id);
                }
            }
    };

    this.setNewLandOwner = function(landId, playerName){
        // parse playerId to Playername....
        svgDoc.getElementById(landId).setAttribute("Owner", playerName);  
    };
    
    this.setLandUnitcount = function(landId, count){
        svgDoc.getElementById(landId).setAttribute("Unitcount", count);  
    };
    
    this.getLandUnitcount = function(landId){
        return (svgDoc.getElementById(landId).getAttribute("Unitcount"));  
    };
    
    this.setRectsOnClickNull = function(){
         var rects = svgDoc.getElementsByTagName("rect");
        [].slice.call(rects).forEach(function(rect){
            rect.onmouseover = "";
            rect.onmouseout = "";
            rect.onclick = "";
            rect.setAttribute('opacity','1');
            rect.style='cursor: default';
        });
    }
    
    this.refreshOwnerRights = function (){
        var rects = svgDoc.getElementsByTagName("rect");
        [].slice.call(rects).forEach(function(rect){
            if(rect.getAttribute("Owner") === Core.getPlayerName()){
                rect.onmouseover = new Function("Core.svgHandler.setOpacityOnRect(this.id, 0.75, 'pointer');");
                rect.onmouseout = new Function("Core.svgHandler.setOpacityOnRect(this.id, 1, 'default');");
                rect.onclick = new Function("Core.svgHandler.identifyAttacker(this.id);");
            }
        });        
    };
    
    this.setOpacityOnRect = function (id, opacity, cursor){
        var rect = svgDoc.getElementById(id + "_back");
        rect.setAttribute('opacity', opacity);
        rect = svgDoc.getElementById(id);
        rect.style = 'cursor: ' + cursor;
    };
    
    this.drawRotatePaperOnCanvas = function(id, rotate){
        if (i < rotate){
            var canvas = svgDoc.getElementById('canvas_' + id);
            var img = new Image();
            img.onload = function(){
                if(canvas.getContext){
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
            drawDigitOnCanvas(id, (1 + parseInt(Math.random() * (6))));
            if(counter == (rotate/18)){
                counter = 0;
                i = 0;
            }
       }
    };
        
    //Private Methods
    
    var drawDigitOnCanvas = function(id, count){
        switch(count){
            case 1:
                count = 6;
                break;
            case 2: 
                count = 5;
                break;
            case 3: 
                count = 4;
                break;
            case 4: 
                count = 3;
                break;
            case 5: 
                count = 2;
                break;
             case 6: 
                count = 1;
                break;
            default: 
                count = null;
        }
        if(count != null){
            var canvas = svgDoc.getElementById('canvas_' + id);
            if(canvas.getContext){
                var context = canvas.getContext('2d');
                context.font = '40pt Arial';
                context.textAlign = 'center';
                context.fillStyle = 'red';
                context.fillText(count, 75, 90);
            }
        }
    };
    
    var initUnitOnMap = function(){
        var rects = svgDoc.getElementsByTagName("rect");
        var xPosition = 0;
        var yPosition = 0;
        var height = 0;
        var width = 0;
        var countryHeight = 0;
        var countryWidth = 0;
        var mapUnitID = svgDoc.getElementById("MapUnit");
        var mapUnitCountCountry = svgDoc.getElementById("UnitCountCountry");
        var rectID = "";
        
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
                mapUnitID.innerHTML = mapUnitID.innerHTML + '<image id="' + rectID + '_Unit" x="' + xPosition + '" y="' + yPosition + '" width="' + width + '" height="' + height + '" xlink:href="/img/player_img/player_red.png" />';
                
                if(countryWidth > 1234){
                    xPosition = xPosition + width * 1.4 ;
                    yPosition = yPosition + height/2 + 130;
                } else {
                    xPosition = xPosition + width/2 ;
                    yPosition = yPosition + height * 1.5;
                }
               
                mapUnitCountCountry.innerHTML = mapUnitCountCountry.innerHTML + '<text id="' + rectID + '_UnitCount" x="' + xPosition + '" y="' + yPosition + '" class="fil6 fnt2" text-anchor="middle">99</text>';
            }
        });
    };
    

     /*
    this.setUnit = function(id, count){
        var theRect = svgDoc.getElementById(id);

        var xPosition = parseInt(theRect.getAttribute("x")) + 10;
        var yPosition = parseInt(theRect.getAttribute("y")) + 10;

        var addUnits = svgDoc.getElementById("MapUnit");

        count = parseInt(count);

        while (count > 0) {
            if(count > 9) {
                 addUnits.innerHTML = addUnits.innerHTML + '<image id="einstein.jpg" x="'+xPosition+'" y="'+yPosition+'" width="893" height="1000" xlink:href="/img/Einstein.jpeg"/>\n';
                 count = count - 10;
            } else {
                if(count > 4) {
                    addUnits.innerHTML = addUnits.innerHTML + '<image id="professor.jpg" x="'+xPosition+'" y="'+yPosition+'" width="893" height="1000" xlink:href="/img/Professor.png"/>\n';
                    count = count - 5;
                } else {
                        addUnits.innerHTML = addUnits.innerHTML + '<image id="einstein.jpg" x="'+xPosition+'" y="'+yPosition+'" width="893" height="1000" xlink:href="/img/student.png"/>\n';
                        count = count - 1;
                }
            }
                
            if((xPosition + 1800) < (parseInt(theRect.getAttribute("x")) + parseInt(theRect.getAttribute("width")))){
                xPosition = xPosition + 910;
            } else {
                if((yPosition + 2010) < (parseInt(theRect.getAttribute("y")) + theRect.getAttribute("height"))){
                    yPosition = yPosition + 1010;
                }
            }
        }
    };*/
}