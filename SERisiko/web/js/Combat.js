

/*
 * 
 * author
 */

function Combat(document){
    var root = document;
    var svgDoc = null;
    
    this.init = function(svgElement){
        svgDoc = svgElement;
    };
    
    this.selectAmountUnit = function(attacker, defender){
        root.getElementById("loading_overlay").style.display = "block";
        root.getElementById("loading_overlay").innerHTML = "\
            <label for='unitAmountAttack'> <div style='color: green;'> Sie greifen an, von " + attacker + " nach " + defender  + " </div><br />\
                                                                        Bitte wählen Sie, mit wie vielen Einheiten Sie Angreifen möchten:</label>\
            <select value='1' name='unitAmountAttack' id='unitAmountAttack' style='margin-bottom: 20px; margin-left: 60px;'></select><br>\
            <button name='abortAttack' onClick='Core.combatHandler.abortAttack();'>Angriff Abbrechen</button>\
            <button name='setUnitAmount' onClick='Core.combatHandler.showAttack(\""+attacker+"\",\""+defender+"\");' style='margin-left: 100px;'>Angriff Starten</button>";
        Core.createSlider("unitAmountAttack", "unitAmountAttack", 1, svgDoc.getElementById(attacker).getAttribute("Unitcount"));
    };
    
    this.showAttack = function (AttackId, DefendId){
        var countRotate = 18;
        var rotate = 0;
        var select = root.getElementById("unitAmountAttack");
        var countAttack = parseInt(select.options[select.selectedIndex].value);
        Core.connectionHandler.sendAttack(AttackId, DefendId, countAttack);
        var countDefend = parseInt(Core.svgHandler.getLandUnitcount(DefendId));
        if(countAttack + countDefend < 5){
            if(countDefend > 2){
                   rotate = (2 + countAttack) * countRotate;
            } else {
                rotate = (countDefend + countAttack) * countRotate;
            }
        } else {
            if(countDefend < 2){
                rotate = ( 1 + 3) * countRotate;
            } else {
                if(countDefend > 2){
                    rotate = (2 + countAttack) * countRotate;
                } else {
                    rotate = 5 * countRotate;
                }
            }
        }
        var OverlayString = '<div id="showAttack">\n\
                                <table id="attackerTable">\n\
                                    <tr>\n\n\
                                        <td>Attacker:</td>\n\
                                        <td>Defender:</td>\n\
                                    </tr>\n\
                                    <tr>\n\
                                        <td>\n\
                                            <canvas width="150" height="150" id="canvas_A1"></canvas><br />';
        setTimeout(function(){Core.svgHandler.drawRotatePaperOnCanvas("A1", rotate);},50);                                    
        if(countAttack > 1){
            OverlayString = OverlayString + '<canvas width="150" height="150" id="canvas_A2" style="margin: 10px 0px;"></canvas><br />\n';
            setTimeout(function(){Core.svgHandler.drawRotatePaperOnCanvas("A2", rotate);},50); 
            if(countAttack > 2){
                OverlayString = OverlayString + '<canvas width="150" height="150" id="canvas_A3"></canvas>\n';
                setTimeout(function(){Core.svgHandler.drawRotatePaperOnCanvas("A3", rotate);},50);
            }
        }
        OverlayString = OverlayString + '</td>\n\
                                        <td>\n\
                                            <canvas width="150" height="150" id="canvas_D1" style="margin-bottom: 50px;"></canvas><br />\n';
        
        setTimeout(function(){Core.svgHandler.drawRotatePaperOnCanvas("D1", rotate);},50);
        if(countDefend > 1){
            OverlayString = OverlayString + '<canvas width="150" height="150" id="canvas_D2"></canvas>\n';
            setTimeout(function(){Core.svgHandler.drawRotatePaperOnCanvas("D2", rotate);},50); 
        }
        OverlayString = OverlayString + '</td>\n\
                                    </tr>\n\
                                </table>\n\
                            </div>\n'+
                            "<button style='margin-top: 20px;' name='StartAttack' onClick='Core.combatHandler.abortAttack()'>Angriff Abbrechen</button>";
        root.getElementById("loading_overlay").innerHTML = OverlayString;
        
        setTimeout(function(){Core.combatHandler.showEndAttack("yes");},3500);
    };
    
    this.showEndAttack = function (arg){
        if(arg == "yes"){
            root.getElementById("loading_overlay").innerHTML = "<div style='color:green; font-size: 28px;'>Sie haben gewonnen!</div><br /><br />\n\
                                                                <button style='margin-top: 20px;' name='abortAttack' onClick='Core.combatHandler.endAttack()'>Angriff Beenden</button>";
        } else {
            root.getElementById("loading_overlay").innerHTML = "<span style='color:green;'>Sie haben verloren!</span>\n\
                                                                <button style='margin-top: 20px;' name='abortAttack' onClick='Core.combatHandler.endAttack()'>Angriff Beende</button>";
        }
    };
    
    this.endAttack = function (){
        this.abortAttack();
    };
    
    this.abortAttack = function (){
        root.getElementById("loading_overlay").innerHTML = '<div id="loading_message">Waiting for Server... \n\
                                                                    <img id="loading" alt="Loading Screen" src="img/loading_overlay.gif">\n\
                                                                </div>';
        root.getElementById("loading_overlay").style.display = "none";
        Core.svgHandler.setRectsOnClickNull();
        Core.svgHandler.refreshOwnerRights();
    };
}