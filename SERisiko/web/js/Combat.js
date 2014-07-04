

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
        return parseInt(dicesArr[id]);
    }
    
    this.selectAmountUnit = function(attacker, defender){
        $( "#bottom_overlay" ).slideUp( "slow");
        root.getElementById("bottom_overlay").innerHTML = "";
        root.getElementById("loading_overlay").style.display = "block";
        root.getElementById("loading_overlay").innerHTML = "\
            <label for='unitAmountAttack'> <div style='color: green;'> Sie greifen an, von " + attacker + " nach " + defender  + " </div><br />\
                                                                        Bitte wählen Sie, mit wie vielen Einheiten Sie Angreifen möchten:</label>\
            <select value='1' name='unitAmountAttack' id='unitAmountAttack' style='margin-bottom: 20px; margin-left: 60px;'></select><br>\
            <button name='abortAttack' onClick='Core.combatHandler.abortAttack();'>Auswahl aufheben</button>\
            <button name='setUnitAmount' onClick='Core.combatHandler.showAttack(\""+attacker+"\",\""+defender+"\", 0);' style='margin-left: 100px;'>Angriff Starten</button>";
        Core.createSlider("unitAmountAttack", "unitAmountAttack", 1, (parseInt(svgDoc.getElementById(attacker).getAttribute("Unitcount"))-1));
    };
    
    this.showAttack = function (attackId, defendId, difference){
        
        var select = root.getElementById("unitAmountAttack");
        if(select != null){
            var countAttack = parseInt(select.options[select.selectedIndex].value);
            difference = parseInt(Core.svgHandler.getLandUnitcount(attackId)) - countAttack;
        }else{
            var countAttack = parseInt(Core.svgHandler.getLandUnitcount(attackId)) - difference;
        }
        
        var countDefend = parseInt(Core.svgHandler.getLandUnitcount(defendId));
        
        if(Core.svgHandler.getLandOwner(defendId) == Core.getPlayerName()){
            Core.combatHandler.showAttackResult(true);
        } else {
            if(parseInt(Core.svgHandler.getLandUnitcount(attackId)) == 1){
                Core.combatHandler.showAttackResult(false);
            }else{ 
                Core.connectionHandler.sendAttack(attackId, defendId, countAttack);
                
                var rotate = getCountRotate(countAttack, countDefend);
                
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
            }
        }
    };
    
    this.showAttackResult = function (arg){
        if(arg == true){
            root.getElementById("loading_overlay").innerHTML = "<div style='color:green; font-size: 28px;'>Sie haben gewonnen!</div><br /><br />\n\
                                                                <button style='margin-top: 20px;' name='abortAttack' onClick='Core.combatHandler.abortAttack()'>Anzeige Schließen</button>";
        } else {
            root.getElementById("loading_overlay").innerHTML = "<div style='color:red; font-size: 28px;'>Sie haben verloren!</div><br /><br />\n\
                                                                <button style='margin-top: 20px;' name='abortAttack' onClick='Core.combatHandler.abortAttack()'>Anzeige Schließen</button>";
        }
        setTimeout(function(){ Core.combatHandler.abortAttack();}, 2000);
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
    
    this.editUnitCount = function(looseUnitsAtt, looseUnitsDef){
        if(looseUnitsAtt > 0){
            var unitAtt = parseInt(document.getElementById("CountAttackerAnz").innerHTML ) - parseInt(looseUnitsAtt);
            var attString = document.getElementById("CountAttackerAnz").innerHTML + "<br>Verloren: " + looseUnitsAtt + "<br>Rest Einheiten: " + unitAtt;
            setTimeout(function(){ document.getElementById("CountAttackerAnz").innerHTML = attString}, 1500);
        }  
        if(looseUnitsDef > 0){
            var unitDef = parseInt(document.getElementById("CountDefenderAnz").innerHTML ) - parseInt(looseUnitsDef);
            var defString = document.getElementById("CountDefenderAnz").innerHTML + "<br>Verloren: " + looseUnitsDef + "<br>Rest Einheiten: " + unitDef;
            setTimeout(function(){ document.getElementById("CountDefenderAnz").innerHTML = defString}, 1500);
        }      
    };
    
    this.showDefeat = function (countAttack, countDefend, attackState){
        root.getElementById("loading_overlay").innerHTML = "";
        root.getElementById("loading_overlay").style.display = "block";
        
        var rotate = getCountRotate(countAttack, countDefend);
        
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
                                    
                                   "<button style='margin-top: 20px;' name='AbortAttack' onClick='Core.combatHandler.showDefeatResult(\""+attackState+"\")'>Angriffsresultat ansehen</button>";
                root.getElementById("loading_overlay").innerHTML = OverlayString;
                setTimeout(function(){ Core.combatHandler.showDefeatResult(attackState);}, 8500);
    };
    
    this.showDefeatResult = function(arg){
        if(arg == true){
            root.getElementById("loading_overlay").innerHTML = "<div style='color:green; font-size: 28px;'>Sie haben gewonnen!</div><br /><br />\n\
                                                                <button style='margin-top: 20px;' name='abortAttack' onClick='Core.combatHandler.abortAttack()'>Anzeige Schließen</button>";
        } else {
            root.getElementById("loading_overlay").innerHTML = "<div style='color:red; font-size: 28px;'>Sie haben verloren!</div><br /><br />\n\
                                                                <button style='margin-top: 20px;' name='abortAttack' onClick='Core.combatHandler.abortAttack()'>Anzeige Schließen</button>";
        }
        setTimeout(function(){ Core.combatHandler.endDefeat();}, 2000);
    };
    
    this.endDefeat = function(){
        root.getElementById("loading_overlay").innerHTML = '';
        root.getElementById("loading_overlay").style.display = "none";
        Core.svgHandler.setRectsOnClickNull();
    };
    
    var getCountRotate = function(attackCount, defendCount){
        var countRotate = 18;
                 
        if(attackCount > 3){
            attackCount = 3;
        }
        
        if(defendCount > 2){
            defendCount = 2;
        }
        
        return (attackCount + defendCount) * countRotate;
    };
}