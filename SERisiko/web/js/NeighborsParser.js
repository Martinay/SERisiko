// ---------------------- #

/**
 *
 * @author Alexander Santana Losada
 */


function NeighborsParser(document){
    //#Private Vars
    var root = document;
    var landData = "";
       
     //# Public Methods
    this.init = function(path){
        landData = buildLandData(path); 
    };
    
    this.isNeighbor = function(source, target){
       return $.inArray(target, this.getNeighbors(source));
    };
    
    this.getNeighbors = function(source){
        return landData.getLandById(source).getNeighbors();
    };
    
    this.getOwnNeighbors = function(source){
        return landData.getLandById(source).getOwnNeighbors(landData);
    };
    this.getLands = function(){
        return landData;
    };
    
     //# Private Methode    
    var buildLandData = function (path) {
        var list = new LandList();
        $.get(path, function(myContentFile) {
            var lines = myContentFile.split("\r\n");
            for(var i  in lines){
                if(lines[i] != ""){
                    var dat = lines[i].split(":");
                    var dat2 = dat[1].split(",");
                    dat2[dat2.length-1] = dat2[dat2.length-1].substr(0, dat2[dat2.length-1].length-1);
                    if(dat[0] != "" && dat[1] != ""){
                        list.addLand(dat[0], dat2);
                    }
                }
            }
        }, 'text');
        return list;
    };
}