/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
function Defend(document){
    var root = document;
    
    this.showDefend = function (countAttack, countDefend, attackState){
        root.getElementById("loading_overlay").innerHTML = "";
        root.getElementById("loading_overlay").style.display = "block";
        
        var rotate = Core.combatHandler.getDicesCountRotate(countAttack, countDefend);
        
        var OverlayString = '<div id="showAttack">\n\
                                        <table id="attackerTable">\n\
                                            <tr>\n\n\
                                                <td colspan="2">Attacker:</td>\n\
                                                <td style="width: 50px;"></td>\n\
                                                <td colspan="2">Defender:</td>\n\
                                            </tr>\n\
                                            <tr>\n\
                                                <td> Einheiten zum Angreifen:<div id="CountAttackAnzahl" style="color: green;"> ' + (parseInt(countAttack) - 1) + '</div></td>\n\
                                                <td>\n\
                                                    <canvas width="150" height="150" id="canvas_A1"></canvas><br />';
                setTimeout(function(){Core.combatHandler.drawRotatePaperOnCanvas("A1", rotate);},50);                                    
                if(countAttack > 1){
                    OverlayString = OverlayString + '<canvas width="150" height="150" id="canvas_A2" style="margin: 10px 0px;"></canvas><br />\n';
                    setTimeout(function(){Core.combatHandler.drawRotatePaperOnCanvas("A2", rotate);},50); 
                    if(countAttack > 2){
                        OverlayString = OverlayString + '<canvas width="150" height="150" id="canvas_A3"></canvas>\n';
                        setTimeout(function(){Core.combatHandler.drawRotatePaperOnCanvas("A3", rotate);},50);
                    }
                }
                OverlayString = OverlayString + '</td>\n\
                                                <td></td>\n\
                                                <td>\n\
                                                    <canvas width="150" height="150" id="canvas_D1" style="margin-bottom: 50px;"></canvas><br />\n';

                setTimeout(function(){Core.combatHandler.drawRotatePaperOnCanvas("D1", rotate);},50);
                if(countDefend > 1){
                    OverlayString = OverlayString + '<canvas width="150" height="150" id="canvas_D2"></canvas>\n';
                    setTimeout(function(){Core.combatHandler.drawRotatePaperOnCanvas("D2", rotate);},50); 
                }
                OverlayString = OverlayString + '</td>\n\
                                                <td> Einheiten zum Verteidigen:<div id="CountDefenderAnzahl" style="color: red;"> ' + countDefend + '</div></td>\n\
                                            </tr>\n\
                                        </table>\n\
                                    </div>\n'+
                                    
                                   "<button style='margin-top: 20px;' name='AbortAttack' onClick='Core.defendHandler.showDefendResult(\""+attackState+"\")'>Angriffsresultat ansehen</button>";
                root.getElementById("loading_overlay").innerHTML = OverlayString;
                setTimeout(function(){ Core.defendHandler.showDefendResult(attackState);}, 8500);
    };
    
    this.showDefendResult = function(arg){
        if(arg == true){
            root.getElementById("loading_overlay").innerHTML = "<div style='color:green; font-size: 28px;'>Sie haben gewonnen!</div><br /><br />\n\
                                                                <button style='margin-top: 20px;' name='clearShowDefend' onClick='Core.defendHandler.clearShowDefend()'>Anzeige Schließen</button>";
        } else {
            root.getElementById("loading_overlay").innerHTML = "<div style='color:red; font-size: 28px;'>Sie haben verloren!</div><br /><br />\n\
                                                                <button style='margin-top: 20px;' name='clearShowDefend' onClick='Core.defendHandler.clearShowDefend()'>Anzeige Schließen</button>";
        }
        setTimeout(function(){ Core.defendHandler.clearShowDefend();}, 2000);
    };
    
    this.clearShowDefend = function(){
        root.getElementById("loading_overlay").innerHTML = '';
        root.getElementById("loading_overlay").style.display = "none";
        Core.svgHandler.setRectsOnClickNull();
    };
}