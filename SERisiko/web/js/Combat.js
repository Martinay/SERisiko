

/*
 * 
 * author
 */

function Combat(document){
    var root = document;
    var svgDoc = null;
    var dicesArr = {};
    
    this.init = function(svgElement){
        svgDoc = svgElement;
    };
    
    this.deleteDices = function(){
        dicesArr = {};
    };
    
    this.setDice = function(id, count){
        dicesArr[id] = count;
    };
    
    this.getDice = function(id){
        return dicesArr[id];
    }
    
    this.selectAmountUnit = function(attacker, defender){
        $( "#bottom_overlay" ).slideUp( "slow");
        root.getElementById("bottom_overlay").innerHTML = "";
        root.getElementById("loading_overlay").style.display = "block";
        root.getElementById("loading_overlay").innerHTML = "\
            <label for='unitAmountAttack'> <div style='color: green;'> Sie greifen an, von " + attacker + " nach " + defender  + " </div><br />\
                                                                        Bitte wählen Sie, mit wie vielen Einheiten Sie Angreifen möchten:</label>\
            <select value='1' name='unitAmountAttack' id='unitAmountAttack' style='margin-bottom: 20px; margin-left: 60px;'></select><br>\
            <button name='abortAttack' onClick='Core.combatHandler.abortAttack();'>Angriff Abbrechen</button>\
            <button name='setUnitAmount' onClick='Core.combatHandler.showAttack(\""+attacker+"\",\""+defender+"\", 0);' style='margin-left: 100px;'>Angriff Starten</button>";
        Core.createSlider("unitAmountAttack", "unitAmountAttack", 1, parseInt(svgDoc.getElementById(attacker).getAttribute("Unitcount")));
    };
    
    this.showAttack = function (attackId, defendId, difference){
        this.deleteDices();
        var countRotate = 18;
        var rotate = 0;
        var select = root.getElementById("unitAmountAttack");
        if(select != null){
            var countAttack = parseInt(select.options[select.selectedIndex].value);
            difference = parseInt(Core.svgHandler.getLandUnitcount(attackId)) - countAttack;
        }else{
            var countAttack = parseInt(Core.svgHandler.getLandUnitcount(attackId)) - difference;
        }
        
        var countDefend = parseInt(Core.svgHandler.getLandUnitcount(defendId));
        
        if(Core.svgHandler.getLandOwner(defendId) == Core.getPlayerName()){
            Core.combatHandler.showAttackResult("win");
        } else {
            if(parseInt(Core.svgHandler.getLandUnitcount(attackId)) == 1){
                Core.combatHandler.showAttackResult("lose");
            }else{ 
                Core.connectionHandler.sendAttack(attackId, defendId, countAttack);
                rotate = ((countAttack + countDefend < 5)?((countDefend > 2)?2:countDefend + countAttack):((countDefend < 2)?( 1 + 3):((countDefend > 2)?(2 + countAttack):5))) * countRotate;
                if(rotate > 5){
                    rotate = 5 * countRotate;
                }
                var OverlayString = '<div id="showAttack">\n\
                                        <table id="attackerTable">\n\
                                            <tr>\n\n\
                                                <td colspan="2">Attacker:</td>\n\
                                                <td style="width: 50px;"></td>\n\
                                                <td colspan="2">Defender:</td>\n\
                                            </tr>\n\
                                            <tr>\n\
                                                <td> Einheiten zum Angreifen:<div id="CountAttackerAnz" style="color: green;"> ' + countAttack + '</div></td>\n\
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
                                                <td></td>\n\
                                                <td>\n\
                                                    <canvas width="150" height="150" id="canvas_D1" style="margin-bottom: 50px;"></canvas><br />\n';

                setTimeout(function(){Core.svgHandler.drawRotatePaperOnCanvas("D1", rotate);},50);
                if(countDefend > 1){
                    OverlayString = OverlayString + '<canvas width="150" height="150" id="canvas_D2"></canvas>\n';
                    setTimeout(function(){Core.svgHandler.drawRotatePaperOnCanvas("D2", rotate);},50); 
                }
                OverlayString = OverlayString + '</td>\n\
                                                <td> Einheiten zum Verteidigen:<div id="CountDefenderAnz" style="color: red;"> ' + countDefend + '</div></td>\n\
                                            </tr>\n\
                                        </table>\n\
                                    </div>\n'+
                                    "<button style='margin-top: 20px;' id='startAttack' name='StartAttack' onClick='Core.combatHandler.showAttack(\""+attackId+"\",\""+defendId+"\",\""+difference+"\")'>Nochmal Angreifen</button>"+
                                    "<button style='margin-top: 20px;' name='AbortAttack' onClick='Core.combatHandler.abortAttack()'>Angriff Beenden</button>";
                root.getElementById("loading_overlay").innerHTML = OverlayString;
                root.getElementById("startAttack").disabled = true;
                this.setDice("A1", (1 + parseInt(Math.random() * (6))));
                this.setDice("A2", (1 + parseInt(Math.random() * (6))));
                this.setDice("A3", (1 + parseInt(Math.random() * (6))));
                this.setDice("D1", (1 + parseInt(Math.random() * (6))));
                this.setDice("D2", (1 + parseInt(Math.random() * (6))));
                
            }
        }
    };
    
    this.showAttackResult = function (arg){
        if(arg == "win"){
            root.getElementById("loading_overlay").innerHTML = "<div style='color:green; font-size: 28px;'>Sie haben gewonnen!</div><br /><br />\n\
                                                                <button style='margin-top: 20px;' name='abortAttack' onClick='Core.combatHandler.endAttack()'>Angriff Beenden</button>";
        } else {
            root.getElementById("loading_overlay").innerHTML = "<span style='color:green;'>Sie haben verloren!</span>\n\
                                                                <button style='margin-top: 20px;' name='abortAttack' onClick='Core.combatHandler.abortAttack()'>Angriff Beende</button>";
        }
    };
    
    this.abortAttack = function (){
        root.getElementById("loading_overlay").innerHTML = '';
        root.getElementById("loading_overlay").style.display = "none";
        Core.svgHandler.setRectsOnClickNull();
        Core.svgHandler.refreshOwnerRights();
    };
    
    this.abortAttack2 = function(){
        $( "#bottom_overlay" ).slideUp( "slow");
        root.getElementById("bottom_overlay").innerHTML = "";
        Core.svgHandler.setRectsOnClickNull();
        Core.svgHandler.refreshOwnerRights();
    };
    
    this.showDefeat = function (attackId, defendId, attackState){
        this.deleteDices();
        var countRotate = 18;
        var rotate = 0;
        
        Core.svgHandler.setOpacityOnRect(attackId, 0.5, "default");
        Core.svgHandler.setOpacityOnRect(defendId, 0.5, "default");
        
        var countAttack = parseInt(Core.svgHandler.getLandUnitcount(attackId));
        var countDefend = parseInt(Core.svgHandler.getLandUnitcount(defendId));
        
        if(dicesArr.length < 3){
            countAttack = dicesArr.length;
        }
        
        if(attackState){
            Core.combatHandler.showAttackResult("lose");
        } else {
            if(parseInt(Core.svgHandler.getLandUnitcount(attackId)) == 1){
                Core.combatHandler.showAttackResult("win");
            }else{
                rotate = ((countAttack + countDefend < 5)?((countDefend > 2)?2:countDefend + countAttack):((countDefend < 2)?( 1 + 3):((countDefend > 2)?(2 + countAttack):5))) * countRotate;
                var OverlayString = '<div id="showAttack">\n\
                                        <table id="attackerTable">\n\
                                            <tr>\n\n\
                                                <td colspan="2">Attacker:</td>\n\
                                                <td style="width: 50px;"></td>\n\
                                                <td colspan="2">Defender:</td>\n\
                                            </tr>\n\
                                            <tr>\n\
                                                <td> Einheiten zum Angreifen:<div id="CountAttackerAnz" style="color: green;"> ' + countAttack + '</div></td>\n\
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
                                                <td></td>\n\
                                                <td>\n\
                                                    <canvas width="150" height="150" id="canvas_D1" style="margin-bottom: 50px;"></canvas><br />\n';

                setTimeout(function(){Core.svgHandler.drawRotatePaperOnCanvas("D1", rotate);},50);
                if(countDefend > 1){
                    OverlayString = OverlayString + '<canvas width="150" height="150" id="canvas_D2"></canvas>\n';
                    setTimeout(function(){Core.svgHandler.drawRotatePaperOnCanvas("D2", rotate);},50); 
                }
                OverlayString = OverlayString + '</td>\n\
                                                <td> Einheiten zum Verteidigen:<div id="CountDefenderAnz" style="color: red;"> ' + countDefend + '</div></td>\n\
                                            </tr>\n\
                                        </table>\n\
                                    </div>\n'+
                                   "<button style='margin-top: 20px;' name='AbortAttack' onClick='Core.combatHandler.abortAttack()'>Anzeige Beenden</button>";
                root.getElementById("loading_overlay").innerHTML = OverlayString;
                root.getElementById("startAttack").disabled = true;
                this.setDice("A1", (1 + parseInt(Math.random() * (6))));
                this.setDice("A2", (1 + parseInt(Math.random() * (6))));
                this.setDice("A3", (1 + parseInt(Math.random() * (6))));
                this.setDice("D1", (1 + parseInt(Math.random() * (6))));
                this.setDice("D2", (1 + parseInt(Math.random() * (6))));
                Core.svgHandler.setOpacityOnRect(attackId, 1, "default");
                Core.svgHandler.setOpacityOnRect(defendId, 1, "default");
            }
        }
    };
}