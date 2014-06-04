// ---------------------- #

/**
 *
 * @author Alexander Santana Losada
 */

/*
 *       Einheit     Abkürzung	In Pixel
 *       Pixel         px           1
 *       Punkt         pt           1,25
 *       Millimeter    mm           3,54
 *       Pica          pc           15
 *       Zentimeter    cm           35,43
 *       Inch          in           90 
 */
function SvgFunctions(root){
    //#Public Vars    
    
    //#Private Vars
    var svgDoc = null;
    var neighborLands = null;
    var myLands = new Array();
    var document = root;
    
    //# Public Methods
    this.init = function(doc){       
        svgDoc = doc;
        this.refreshOwnerRights();
        initUnitOnMap();
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

    this.identifyAttacker = function(id){
        var theRect = svgDoc.getElementById(id);
        
        neighborLands = theRect.getAttribute("neighbor").split(",");
            
        theRect.setAttribute('opacity','0.3');
            //this.setUnit(id, 16);

        for (var i = 0; i < myLands.length; i++) {
            theRect = svgDoc.getElementById(myLands[i]);
            theRect.onmouseover = new Function("");
            theRect.onmouseout = new Function("");
            theRect.onclick = new Function("");
        }
        for (var i = 0; i < neighborLands.length; i++) {
            theRect = svgDoc.getElementById(neighborLands[i]);
            if(theRect.getAttribute("Owner") !=  Core.getPlayerName()){
                theRect.onmouseover = new Function("this.setAttribute('opacity', '0.5'); this.style='cursor: pointer';");
                theRect.onmouseout = new Function("this.setAttribute('opacity','0.75'); this.style='cursor: default';");
                theRect.onclick = new Function("Core.svgHandler.identifyDestination(this.id, '" + id + "' );");
                theRect.setAttribute('opacity','0.75');
            }
        }
    };
    
    this.identifyDestination = function(id, attacker){
        var theRect = svgDoc.getElementById(id);

        for (var i = 0; i < neighborLands.length; i++) {
            if(id == neighborLands[i]){
                    theRect = svgDoc.getElementById(attacker);
                    theRect.onmouseout = new Function("this.setAttribute('opacity','1');");
                    theRect.setAttribute('opacity','1');
                    selectAmountUnit(attacker);
                    var rects = svgDoc.getElementsByTagName("rect");
                    [].slice.call(rects).forEach(function(rect){
                            rect.onmouseover = "";
                            rect.onmouseout = "";
                            rect.onclick = "";
                            rect.setAttribute('opacity','1');
                            rect.style='cursor: default';
                    });
                    this.refreshOwnerRights();
                }
            }
    };

    this.setNewLandOwner = function(landId, playerName){
        // parse playerId to Playername....
        svgDoc.getElementById(landId).setAttribute('Owner', playerName);  
    };
    
    this.setLandUnitcount = function(landId, count){
        svgDoc.getElementById(landId).setAttribute('Unicount', count);  
    };
    
    this.refreshOwnerRights = function (){
        var rects = svgDoc.getElementsByTagName("rect");
        [].slice.call(rects).forEach(function(rect){
            if(rect.getAttribute("Owner") === Core.getPlayerName()){
                rect.onmouseover = new Function("this.setAttribute('opacity', '0.75'); this.style='cursor: pointer';");
                rect.onmouseout = new Function("this.setAttribute('opacity','1'); this.style='cursor: default';");
                //rect.onclick = new Function("Core.svgHandler.setUnit(this.id, 10);");
                rect.onclick = new Function("Core.svgHandler.identifyAttacker(this.id);");
                
                myLands.push(rect.getAttribute("id"));
            }
        });        
    };
    
    this.showAttack = function (){
        //var OverlayString = '<div id="showAttack">\n<table id="attackerTable">\n<tr>\n<td>Attacker:</td>\n<td>Defender:</td>\n</tr>\n<tr>\n<td>\n<img id="AttackPNG1" alt="Attack" src="img/paper.png" height="150"><br />\n<img id="AttackPNG2" alt="Attack" src="img/paper.png" height="150" style="margin: 10px 0px;"><br />\n<img id="AttackPNG3" alt="Attack" src="img/paper.png" height="150">\n</td>\n<td>\n<img id="DefendPNG1" alt="Defend" src="img/paper.png" height="150" style="margin-bottom: 50px;"><br />\n<img id="DefendPNG2" alt="Defend" src="img/paper.png" height="150">\n</td>\n</tr>\n</table>\n</div>\n';
        var OverlayString = '<div id="showAttack"><canvas width="300" height="300" id="canvas_id" style="border: 1px solid rgb(51, 51, 51);"></div>';
        document.getElementById("loading_overlay").innerHTML = OverlayString + "<button style='margin-top: 20px;' name='StartAttack' onClick='Core.svgHandler.rotate()'>Angriff Abbrechen</button>";
        initCanvas();
    };
    
    this.abortAttack = function (){
        document.getElementById("loading_overlay").innerHTML = '<div id="loading_message">Waiting for Server... <img id="loading" alt="Loading Screen" src="img/loading_overlay.gif"></div>';
        document.getElementById("loading_overlay").style.display = "none";    
    };
    
    this.rotate = function (){
        initCanvas();
    }
    
    //# Private Methods
    var selectAmountUnit = function(attacker){
        document.getElementById("loading_overlay").style.display = "block";
        //var OverlayString = '<div id="ShowAttack">\n<table>\n<tr>\n<td>Attacker:</td>\n<td>Defender:</td>\n</tr>\n<tr>\n<td>\n<img id="AttackPNG1" alt="Attack" src="img/paper.png" height="150"><br />\n<img id="AttackPNG2" alt="Attack" src="img/paper.png" height="150"><br />\n<img id="AttackPNG3" alt="Attack" src="img/paper.png" height="150">\n</td>\n<td>\n<img id="DefendPNG1" alt="Defend" src="img/paper.png" height="150"><br />\n<img id="DefendPNG2" alt="Defend" src="img/paper.png" height="150">\n</td>\n</tr>\n</table>\n</div>\n';
        //setTimeout(function(){document.getElementById("loading_overlay").innerHTML = OverlayString;},1000);
        //setTimeout(function(){document.getElementById("loading_overlay").style.display = "none";},1000);
        //setTimeout(function(){document.getElementById("loading_overlay").innerHTML = '<div id="loading_message">Waiting for Server... <img id="loading" alt="Loading Screen" src="img/loading_overlay.gif"></div>';},500);
        document.getElementById("loading_overlay").innerHTML = "\
            <label for='unitAmount'> Bitte wählen Sie, mit wie vielen Einheiten Sie Angreifen möchten:</label>\
            <select value='1' name='unitAmount' id='unitAmount' style='margin-bottom: 20px; margin-left: 60px;'></select><br>\
            <button id='insertSliderAfter' name='setUnitAmount' onClick='Core.svgHandler.showAttack()'>Angriff Starten</button>";
        Core.createSlider("unitAmount", "insertSliderAfter", 1, svgDoc.getElementById(attacker).getAttribute("Unitcount"));
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
            if(rectID !== ""){
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
    
    var initCanvas = function(){
        var objCanvas = document.getElementById("canvas_id");
        // Falls das Objekt unterstützt wird
        if(objCanvas.getContext){
          // Kontext
          objContext = objCanvas.getContext('2d');

          var objImg = new Image();
          // onload-Event vor dem Zuweisen der Quelle (wg. Opera)
          objImg.onload = function(){ rotateIt(objContext, objImg, 120);}
          objImg.src = "/img/paper.png";  // Breite: 120 px, Höhe: 120px
        }else{
          // Sonstiger Code
        } 
    };
    
    var rotateIt = function(objContext, objImg, lngPhi){
        objContext.translate(300, 300);           // Ursprung verschieben
        objContext.rotate((lngPhi*Math.PI/180));  // Context drehen
        objContext.drawImage(objImg, -150, -150);   // Bild zentriert zeichnen
    }
}
