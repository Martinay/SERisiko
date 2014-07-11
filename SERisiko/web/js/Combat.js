/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
function Combat(doc){
    var root = doc;
    var DicesArr = {};
    
    this.setDice = function(id, count){
        DicesArr[id] = count;
    };
    
    this.getDice = function(id){
        return parseInt(DicesArr[id]);  
    };
    
    this.deleteDices = function(){
        DicesArr = {};
    };
    
    this.showCombat = function(message){
        var defeater = false;
        var attacker = false;
        var lands = new Array();
        var looseUnitCounts = new Array();
        var defeatstate = true;
        var attackstate = null;
        var attackDiceCount = 1;
        var defeatDiceCount = 1;
        this.deleteDices();
        
        for (var i = 0; i < message.data.length; i++){
            if(message.data[i].MapChange){
                lands[i] = Core.svgHandler.getLandUnitcount(message.data[i].MapChange.countryId);
                looseUnitCounts[i] = parseInt(lands[i]) - parseInt(message.data[i].MapChange.unitCount);
                if(Core.svgHandler.getLandOwner(message.data[i].MapChange.countryId) == Core.getPlayerId()){
                    if(i == 0){
                        attacker = true;
                    } else if(i == 1){
                        defeater = true;
                    }
                }
                if(Core.svgHandler.getLandOwner(message.data[i].MapChange.countryId) == message.data[i].MapChange.ownerId){
                    Core.mapAnimationHandler.prepareUnitAddRemove(message.data[i].MapChange.countryId,  message.data[i].MapChange.unitCount);
                    if(i == 0 && message.data[i].MapChange.unitCount == 1){
                       attackstate = false; 
                    }
                } else {
                    looseUnitCounts[i] = Core.svgHandler.getLandUnitcount(message.data[i].MapChange.countryId);
                    Core.svgHandler.setLandComplete(message.data[i].MapChange.countryId, message.data[i].MapChange.ownerId, message.data[i].MapChange.unitCount);
                    looseUnitCounts[0] = looseUnitCounts[0] - (parseInt(message.data[i].MapChange.unitCount) + 1);
                    defeatstate = false;
                    attackstate = true;
                }
            }
            if(message.data[i].Dice){
                if(message.data[i].Dice.type == "Attacker"){
                    this.setDice("A" + attackDiceCount, message.data[i].Dice.value);
                    attackDiceCount++;
                }
                if(message.data[i].Dice.type == "Defender"){
                    this.setDice("D" + defeatDiceCount, message.data[i].Dice.value);
                    defeatDiceCount++;
                }
            }
        } 
        if(attacker == true){
            editUnitCountDisplay(looseUnitCounts[0], looseUnitCounts[1]);
            Core.svgHandler.refreshOwnerRights();
            if(attackstate != null){
                setTimeout(function(){ Core.attackHandler.showAttackResult(attackstate);}, 2000);
            }
        } else if(defeater == true){
            Core.defendHandler.showDefend(lands[0], lands[1], defeatstate);
            editUnitCountDisplay(looseUnitCounts[0], looseUnitCounts[1]);
        }
    };
    
    var editUnitCountDisplay = function(looseUnitsAttack, looseUnitsDefend){
        if(looseUnitsAttack > 0){
            var unitsAfterAttack = parseInt(root.getElementById("CountAttackAnzahl").innerHTML ) - parseInt(looseUnitsAttack);
            var attackString = "<div style='color: #FFFFFF;'>Verloren: </div>-" + looseUnitsAttack + "<div style='color: #FFFFFF;'>Rest Einheiten: </div>" + unitsAfterAttack;
            setTimeout(function(){ $("#CountAttackAnzahl").append(attackString)}, 1000);
        }  
        if(looseUnitsDefend > 0){
            var unitsAfterDefend = parseInt(root.getElementById("CountDefenderAnzahl").innerHTML ) - parseInt(looseUnitsDefend);
            var defendString = "<div style='color: #FFFFFF;'>Verloren: </div>-" + looseUnitsDefend + "<div style='color: #FFFFFF;'>Rest Einheiten: </div>" + unitsAfterDefend;
            setTimeout(function(){ $("#CountDefenderAnzahl").append(defendString)}, 1000);
        }      
        if(parseInt(root.getElementById("CountAttackAnzahl").innerHTML ) - parseInt(looseUnitsAttack) > 0)
            root.getElementById("startAttack").disabled = false;
    };
    
    this.getDicesCountRotate = function(attackCount, defendCount){
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