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
    var document = root;
    var i = 0;
    
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
        this.setRectsOnClickNull();
        var theRect = svgDoc.getElementById(id);
        neighborLands = theRect.getAttribute("neighbor").split(",");
        theRect.setAttribute('opacity','0.3');
        //this.setUnit(id, 16);
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
        this.setRectsOnClickNull();
        var theRect = svgDoc.getElementById(attacker);
        theRect.setAttribute('opacity','0.5');
        var theRect = svgDoc.getElementById(id);
        theRect.setAttribute('opacity','0.5');
        for (var i = 0; i < neighborLands.length; i++) {
            if(id != neighborLands[i]){
                    theRect = svgDoc.getElementById(neighborLands[i]);
                    theRect.onmouseout = new Function("this.setAttribute('opacity','1');");
                    theRect.setAttribute('opacity','1');
                    selectAmountUnit(attacker);
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
                rect.onmouseover = new Function("this.setAttribute('opacity', '0.75'); this.style='cursor: pointer';");
                rect.onmouseout = new Function("this.setAttribute('opacity','1'); this.style='cursor: default';");
                //rect.onclick = new Function("Core.svgHandler.setUnit(this.id, 10);");
                rect.onclick = new Function("Core.svgHandler.identifyAttacker(this.id);");
            }
        });        
    };
    
    this.showAttack = function (){
        var OverlayString = '<div id="showAttack">\n\
                                <table id="attackerTable">\n\
                                    <tr>\n\n\
                                        <td>Attacker:</td>\n\
                                        <td>Defender:</td>\n\
                                    </tr>\n\
                                    <tr>\n\
                                        <td>\n\
                                            <canvas width="150" height="150" id="canvas_A1"></canvas><br />\n\
                                            <canvas width="150" height="150" id="canvas_A2" style="margin: 10px 0px;"></canvas><br />\n\
                                            <canvas width="150" height="150" id="canvas_A3"></canvas>\n\
                                        </td>\n\
                                        <td>\n\
                                            <canvas width="150" height="150" id="canvas_D1" style="margin-bottom: 50px;"></canvas><br />\n\
                                            <canvas width="150" height="150" id="canvas_D2"></canvas>\n\
                                        </td>\n\
                                    </tr>\n\
                                </table>\n\
                            </div>\n'+
                            "<button style='margin-top: 20px;' name='StartAttack' onClick='Core.svgHandler.abortAttack()'>Angriff Abbrechen</button>";
        document.getElementById("loading_overlay").innerHTML = OverlayString;
        this.drawPicOnCanvas("A1");
        this.drawPicOnCanvas("A2");
        this.drawPicOnCanvas("A3");
        this.drawPicOnCanvas("D1");
        this.drawPicOnCanvas("D2");
    };
    
    
    this.abortAttack = function (){
        document.getElementById("loading_overlay").innerHTML = '<div id="loading_message">Waiting for Server... \n\
                                                                    <img id="loading" alt="Loading Screen" src="img/loading_overlay.gif">\n\
                                                                </div>';
        document.getElementById("loading_overlay").style.display = "none";
        this.setRectsOnClickNull();
        this.refreshOwnerRights();
    };
    
    //# Private Methods
    var selectAmountUnit = function(attacker){
        document.getElementById("loading_overlay").style.display = "block";
        document.getElementById("loading_overlay").innerHTML = "\
            <label for='unitAmountAttack'> Bitte wählen Sie, mit wie vielen Einheiten Sie Angreifen möchten:</label>\
            <select value='1' name='unitAmountAttack' id='unitAmountAttack' style='margin-bottom: 20px; margin-left: 60px;'></select><br>\
            <button name='setUnitAmount' onClick='Core.svgHandler.showAttack()'>Angriff Starten</button>";
        Core.createSlider("unitAmountAttack", "unitAmountAttack", 1, svgDoc.getElementById(attacker).getAttribute("Unitcount"));
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
    
    this.drawPicOnCanvas = function(id){
        if (i < 90){
            var canvas = document.getElementById('canvas_' + id);
            var img = new Image();
            img.onload = function(){
                if(canvas.getContext){
                    var context = canvas.getContext('2d');
                    context.beginPath();    
                    context.rect(0, 0, 150, 150);    
                    context.fillStyle = 'rgba(0, 0, 0, .9)';
                    context.fill();
                    context.translate(75, 75);
                    context.rotate(20*Math.PI/180);
                    context.translate(-75, -75);
                    context.drawImage(img, 0, 0, 150, 150);
                }
            }
            img.src = '/img/paper.png';
            i++;
            setTimeout(function(){Core.svgHandler.drawPicOnCanvas(id);},100);
       }else{
            var canvas = document.getElementById('canvas_' + id);
                if(canvas.getContext){
                    var context = canvas.getContext('2d');
                    context.font = '40pt Arial';
                    context.textAlign = 'center';
                    context.fillStyle = 'red';
                    context.fillText((1 + parseInt(Math.random() * (6))), 75, 90);
                }
       }
    };
}
