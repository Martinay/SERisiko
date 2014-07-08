// ---------------------- #

/**
 *
 * @author Alexander Santana Losada
 */


function NeighborsParser(document, svg){
    //#Private Vars
    var root = document;
    var svgDoc = svg;
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
    
     //# Private Methode    
    var buildLandData = function (path) {
        var list = new LandList();
        $.get(path, function(myContentFile) {
            var lines = myContentFile.split("\r\n");
            for(var i  in lines){
                if(lines[i] != ""){
                    var dat = lines[i].split(":");
                    var dat2 = dat[1].split(",").slice(0, -1);
                    if(dat[0] != "" && dat[1] != ""){
                        var imgMov = svgDoc.getElementById(dat[0] + '_Unit');
                        list.addLand(dat[0], dat2, parseInt(imgMov.getAttribute("x")), parseInt(imgMov.getAttribute("y")));
                    }
                }
            }
        }, 'text');
        return list;
    };
}