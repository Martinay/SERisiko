/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function Combat(root){
    var document = root;
    var svgDoc = null;
    
    this.init = function(svgElement){
        svgDoc = svgElement;
    };
    
    this.showAttack = function (DefendId){
        var countRotate = 18;
        var rotate = 0;
        var select = document.getElementById("unitAmountAttack");
        var countAttack = parseInt(select.options[select.selectedIndex].value);
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
        document.getElementById("loading_overlay").innerHTML = OverlayString;
        
        setTimeout(function(){Core.combatHandler.showEndAttack("yes", countAttack);},3500);
    };
    
    this.showEndAttack = function (arg, Count){
        if(arg == "yes"){
            document.getElementById("loading_overlay").innerHTML = "<div style='color:green; font-size: 28px;'>Sie haben gewonnen!</div><br /><br />\n\
                                                                    <label for='unitAmountMove'> Bitte wählen Sie, wie viele Einheiten verschoben werden sollen:</label>\
                                                                    <select value='1' name='unitAmountMove' id='unitAmountMove' style='margin-bottom: 20px; margin-left: 60px;'></select><br/><br/>\
                                                                    <button style='margin-top: 20px;' name='AttackFinish' onClick='Core.combatHandler.MoveUnitAfterAttack()'>Einheiten verschieben</button>";
            Core.createSlider("unitAmountMove", "unitAmountMove", 1, Count);
        } else {
            document.getElementById("loading_overlay").innerHTML = "<span style='color:green;'>Sie haben verloren!</span>";
        }
    };
    
    this.MoveUnitAfterAttack = function (){
         this.abortAttack();
    };
    
    this.abortAttack = function (){
        document.getElementById("loading_overlay").innerHTML = '<div id="loading_message">Waiting for Server... \n\
                                                                    <img id="loading" alt="Loading Screen" src="img/loading_overlay.gif">\n\
                                                                </div>';
        document.getElementById("loading_overlay").style.display = "none";
        Core.svgHandler.setRectsOnClickNull();
        Core.svgHandler.refreshOwnerRights();
    };
    
    this.selectAmountUnit = function(attacker, defender){
        document.getElementById("loading_overlay").style.display = "block";
        document.getElementById("loading_overlay").innerHTML = "\
            <label for='unitAmountAttack'> Bitte wählen Sie, mit wie vielen Einheiten Sie Angreifen möchten:</label>\
            <select value='1' name='unitAmountAttack' id='unitAmountAttack' style='margin-bottom: 20px; margin-left: 60px;'></select><br>\
            <button name='setUnitAmount' onClick='Core.combatHandler.showAttack(\""+defender+"\")'>Angriff Starten</button>";
        Core.createSlider("unitAmountAttack", "unitAmountAttack", 1, svgDoc.getElementById(attacker).getAttribute("Unitcount"));
     };
}