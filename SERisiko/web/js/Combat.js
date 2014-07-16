/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
function Combat(doc){
    var root = doc;
    var DicesArr = {};
    var counter = 0;
    var i = 0;
    
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
                if(Core.svgHandler.getLandOwner(message.data[i].MapChange.countryId) === Core.getPlayerId()){
                    if(i === 0){
                        attacker = true;
                    } else if(i === 1){
                        defeater = true;
                    }
                }
            }
            if(message.data[i].Dice){
                if(message.data[i].Dice.type === "Attacker"){
                    this.setDice("A" + attackDiceCount, message.data[i].Dice.value);
                    attackDiceCount++;
                }
                if(message.data[i].Dice.type === "Defender"){
                    this.setDice("D" + defeatDiceCount, message.data[i].Dice.value);
                    defeatDiceCount++;
                }
            }
        }
        if(Core.svgHandler.getLandOwner(message.data[1].MapChange.countryId) === parseInt(message.data[1].MapChange.ownerId)){
            Core.mapAnimationHandler.prepareUnitAddRemove(message.data[1].MapChange.countryId, message.data[1].MapChange.unitCount);
            Core.mapAnimationHandler.prepareUnitAddRemove(message.data[0].MapChange.countryId, message.data[0].MapChange.unitCount);
            if(message.data[0].MapChange.unitCount === 1){
                attackstate = false; 
            }
        } else {
            looseUnitCounts[1] = Core.svgHandler.getLandUnitcount(message.data[1].MapChange.countryId);
            looseUnitCounts[0] = looseUnitCounts[0] - (parseInt(message.data[1].MapChange.unitCount) + 1);
            defeatstate = false;
            attackstate = true;
            Core.mapAnimationHandler.prepareUnitAddRemove(message.data[1].MapChange.countryId,  0);
            Core.svgHandler.setLandUnitcount(message.data[0].MapChange.countryId, message.data[0].MapChange.unitCount);
            Core.mapAnimationHandler.doMovementAnimation(message.data[0].MapChange.countryId, message.data[1].MapChange.countryId, message.data[1].MapChange.unitCount);
            Core.svgHandler.setLandComplete(message.data[1].MapChange.countryId, message.data[1].MapChange.ownerId, message.data[1].MapChange.unitCount);
        }
        if(attacker === true){
            editUnitCountDisplay(looseUnitCounts[0], looseUnitCounts[1]);
            Core.svgHandler.refreshOwnerRights();
            if(attackstate !== null){
                //setTimeout(function(){ Core.attackHandler.showAttackResult(attackstate);}, 2000);
            }
        } else if(defeater === true){
            Core.defendHandler.showDefend(lands[0], lands[1], attackDiceCount,  defeatstate);
            editUnitCountDisplay(looseUnitCounts[0], looseUnitCounts[1]);
        }
    };
    
    var editUnitCountDisplay = function(looseUnitsAttack, looseUnitsDefend){
        if(looseUnitsAttack > 0){
            var unitsAfterAttack = parseInt(root.getElementById("CountAttackAnzahl").innerHTML ) - parseInt(looseUnitsAttack);
            var attackString = "<div style='color: #FFFFFF;'>Verloren: </div>-" + looseUnitsAttack + "<div style='color: #FFFFFF;'>Rest Einheiten: </div>" + unitsAfterAttack;
            setTimeout(function(){ $("#CountAttackAnzahl").append(attackString);}, 1000);
        }  
        if(looseUnitsDefend > 0){
            var unitsAfterDefend = parseInt(root.getElementById("CountDefenderAnzahl").innerHTML ) - parseInt(looseUnitsDefend);
            var defendString = "<div style='color: #FFFFFF;'>Verloren: </div>-" + looseUnitsDefend + "<div style='color: #FFFFFF;'>Rest Einheiten: </div>" + unitsAfterDefend;
            setTimeout(function(){ $("#CountDefenderAnzahl").append(defendString);}, 1000);
        }      
        setTimeout(function(){enableStartAttack(looseUnitsAttack)}, 1000);
    };
    
    var enableStartAttack = function(looseUnitsAttack){
        if(parseInt(root.getElementById("CountAttackAnzahl").innerHTML ) - parseInt(looseUnitsAttack) > 0 &&  root.getElementById("startAttack") !== null)
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
    
    this.drawRotatePaperOnCanvas = function(id, rotate){
        if (i < rotate){
            var canvas = root.getElementById('canvas_' + id);
            var img = new Image();
            img.onload = function(){
                if(canvas !== null && canvas.getContext){
                    var context = canvas.getContext('2d');
                    context.beginPath();    
                    context.rect(0, 0, 150, 150);    
                    context.fillStyle = 'rgba(0, 0, 0, .9)';
                    context.fill();
                    context.translate(75, 75);
                    context.rotate(20 * Math.PI / 180);
                    context.translate(-75, -75);
                    context.drawImage(img, 0, 0, 150, 150);
                }
            };
            img.src = '/img/paper.png';
            i++;
            setTimeout(function(){Core.combatHandler.drawRotatePaperOnCanvas(id, rotate);},50);
       }else{
            counter++;
            drawDigitOnCanvas(id);
            if(counter === (rotate/18)){
                counter = 0;
                i = 0;
            }
       }
    };
    
    var drawDigitOnCanvas = function(id){
        var count = Core.combatHandler.getDice(id);
        count = 7-count;
        var canvas = root.getElementById('canvas_' + id);
        if(canvas !== null && canvas.getContext){
            var context = canvas.getContext('2d');
            context.font = '40pt Arial';
            context.textAlign = 'center';
            context.fillStyle = 'red';
            context.fillText(count, 75, 90);
        }
    }; 
}