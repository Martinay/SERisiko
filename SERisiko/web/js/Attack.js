

/*
 * 
 * author
 */

function Attack(document){
    var root = document;
    
    this.selectAmountUnit = function(attacker, defender){
        root.getElementById("gameMap").style.height = "660px";
        root.getElementById("bottom_overlay").style.height = "70px";
        $( "#bottom_overlay" ).slideUp( "slow");
        root.getElementById("bottom_overlay").innerHTML = "";
        root.getElementById("loading_overlay").style.display = "block";
        root.getElementById("loading_overlay").innerHTML = "\
            <label for='unitAmountAttack'> <div style='color: green;'> Sie greifen an, von " + attacker + " nach " + defender  + " </div><br />\
                                                                        Bitte wählen Sie, mit wie vielen Einheiten Sie Angreifen möchten:</label>\
            <select value='1' name='unitAmountAttack' id='unitAmountAttack' style='margin-bottom: 20px; margin-left: 60px;'></select><br>\
            <button name='clearAttackDisplay' onClick='Core.attackHandler.clearAttackDisplay();'>Auswahl aufheben</button>"+
            "<button style='margin-left: 100px;' name='setUnitAmount' onClick='Core.attackHandler.showAttack(\""+attacker+"\",\""+defender+"\", 0);'>Angriff Starten</button>";
        Core.createSlider("unitAmountAttack", "unitAmountAttack", 1, (parseInt(Core.svgHandler.getLandUnitcount(attacker))-1));
    };
    
    this.showAttack = function (attackId, defendId, difference){
        var select = root.getElementById("unitAmountAttack");
        if(select !== null){
            var countAttack = parseInt(select.options[select.selectedIndex].value);
            difference = parseInt(Core.svgHandler.getLandUnitcount(attackId)) - countAttack;
        }else{
            var countAttack = parseInt(Core.svgHandler.getLandUnitcount(attackId)) - difference;
        }
        
        var countDefend = parseInt(Core.svgHandler.getLandUnitcount(defendId));
        
        Core.connectionHandler.sendAttack(attackId, defendId, countAttack);
                
        var rotate = Core.combatHandler.getDicesCountRotate(countAttack, countDefend);
                
        var OverlayString = '<div id="showAttack">\n\
                                        <table id="attackerTable">\n\
                                            <tr>\n\n\
                                                <td colspan="2">Attacker: (' + attackId + ')</td>\n\
                                                <td style="width: 50px;"></td>\n\
                                                <td colspan="2">Defender: (' + defendId + ')</td>\n\
                                            </tr>\n\
                                            <tr>\n\
                                                <td> Einheiten zum Angreifen:<div id="CountAttackAnzahl" style="color: green;"> ' + countAttack + '</div></td>\n\
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
                                    "<button style='margin-top: 20px; margin-right: 60px;' id='startAttack' name='StartAttack' onClick='Core.attackHandler.showAttack(\""+attackId+"\",\""+defendId+"\",\""+difference+"\")'>Nochmal Angreifen</button>"+
                                    "<button style='margin-top: 20px;' id='abortAttack' name='AbortAttack' onClick='Core.attackHandler.clearAttackDisplay()'>Angriff Beenden</button>";
        root.getElementById("loading_overlay").innerHTML = OverlayString;
        root.getElementById("startAttack").disabled = true;
    };
    
    this.clearAttackDisplay = function (){
        root.getElementById("loading_overlay").innerHTML = '';
        root.getElementById("loading_overlay").style.display = "none";
        Core.svgHandler.setRectsOnClickNull();
        Core.svgHandler.refreshOwnerRights();
    };
    
    this.clearAttackBottomDisplay = function(){
        root.getElementById("gameMap").style.height = "660px";
        $( "#bottom_overlay" ).slideUp( "slow");
        root.getElementById("bottom_overlay").innerHTML = "";
        Core.svgHandler.setRectsOnClickNull();
        Core.svgHandler.refreshOwnerRights();
    };
}