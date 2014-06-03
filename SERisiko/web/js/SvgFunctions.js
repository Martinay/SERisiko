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
function SvgFunctions(){
    //#Public Vars    
    
    //#Private Vars
    var svgDoc = null;
    var neighborLands = null;
    var myLands = new Array();
    
    var countAttack = 0;
    var attacker = "";
    var defender = "";
    
    //# Public Methods
    this.init = function(doc){
        var i = 0;
        
        svgDoc = doc;
        rects = svgDoc.getElementsByTagName("rect");
        [].slice.call(rects).forEach(function(rect){
            if(rect.getAttribute("Owner") === "Ihr SpielernaG"){
                rect.onmouseover = new Function("this.setAttribute('opacity', '0.75'); this.style='cursor: pointer';");
                rect.onmouseout = new Function("this.setAttribute('opacity','1'); this.style='cursor: default';");
                //rect.onclick = new Function("Core.svgHandler.setUnit(this.id, 10);");
                rect.onclick = new Function("Core.svgHandler.attack(this.id);");
                myLands[i] = rect.getAttribute("id");
                i++;
            }
        });
    };
        
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
    };

    this.attack = function(id){
        var theRect = svgDoc.getElementById(id);

        if(countAttack === 0){
            neighborLands = theRect.getAttribute("neighbor").split(",");
            attacker = id;
            theRect.onmouseout = new Function("this.setAttribute('opacity','0.5');");
            //this.setUnit(id, 16);
            countAttack++;
            for (var i = 0; i < myLands.length; i++) {
                theRect = svgDoc.getElementById(myLands[i]);
                theRect.onmouseover = new Function("");
                theRect.onmouseout = new Function("");
                theRect.onclick = new Function("");
            }
            for (var i = 0; i < neighborLands.length; i++) {
                theRect = svgDoc.getElementById(neighborLands[i]);
                if(theRect.getAttribute("Owner") !=  "Ihr SpielernaG"){
                    theRect.onmouseover = new Function("this.setAttribute('opacity', '0.75'); this.style='cursor: pointer';");
                    theRect.onmouseout = new Function("this.setAttribute('opacity','1'); this.style='cursor: default';");
                    theRect.onclick = new Function("Core.svgHandler.attack(this.id);");
                }
            }
        } else { 
            for (var i = 0; i < neighborLands.length; i++) {
                if(id === neighborLands[i]){
                    defender = id;
                    theRect = svgDoc.getElementById(attacker);
                    theRect.onmouseout = new Function("this.setAttribute('opacity','1');");
                    theRect.setAttribute('opacity','1');
                    countAttack = 0;
                    showAttack();
                }
            }
            if(countAttack === 1){
                countAttack = 0;
                theRect = svgDoc.getElementById(attacker);
                theRect.onmouseout = new Function("this.setAttribute('opacity','1');");
                theRect.setAttribute('opacity','1');
                Alert("Dieser Angriff ist nicht möglich!!!");
            }
        }
    };


    //# Private Methods
    var transform = function(){
        svgDoc.setAttribute("transform", "translate(" + xPos + "," + yPos + ")scale(" + scaleLevel + "," + scaleLevel + ")");
    };
    
    var getCenter = function(){
        var width = svgDoc.getBBox().width;
        var height = svgDoc.getBBox().height;
        
        return [width / 2 + xPos, height/2 + yPos];
    };
        
    var showAttack = function(){
        document.getElementById("loading_overlay").style.display = "block";
        var OverlayString = '<div id="ShowAttack">\n<table>\n<tr>\n<td>Attacker:</td>\n<td>Defender:</td>\n</tr>\n<tr>\n<td>\n<img id="AttackPNG1" alt="Attack" src="img/paper.png" height="150"><br />\n<img id="AttackPNG2" alt="Attack" src="img/paper.png" height="150"><br />\n<img id="AttackPNG3" alt="Attack" src="img/paper.png" height="150">\n</td>\n<td>\n<img id="DefendPNG1" alt="Defend" src="img/paper.png" height="150"><br />\n<img id="DefendPNG2" alt="Defend" src="img/paper.png" height="150">\n</td>\n</tr>\n</table>\n</div>\n';
        setTimeout(function(){document.getElementById("loading_overlay").innerHTML = OverlayString;},2000);
        setTimeout(function(){document.getElementById("loading_overlay").style.display = "none";},10000);
        setTimeout(function(){document.getElementById("loading_overlay").innerHTML = '<div id="loading_message">Waiting for Server... <img id="loading" alt="Loading Screen" src="img/loading_overlay.gif"></div>';},10000);
    };
}