// ---------------------- #

/**
 *
 * @author Alexander Santana Losada
 */

/*
 *       Einheit     Abkürzung	In Pixel
 *       Pixel         px           1
 *       Punkt         pt           1,25
 *       Millimeter    mm           3,54
 *       Pica          pc           15
 *       Zentimeter    cm           35,43
 *       Inch          in           90 
 */

function SvgFunctions(){
    //#Public Vars    
    
    //#Private Vars
    var svgDoc = null;
    var scaleLevel = 1;
    var scaleAmp = 0.1;
    var movAmp = 50;
    var xPos = 0;
    var yPos = 0;
    
    var scale_tmp = 0;
    
    //# Public Methods
    this.init = function(doc){
        svgDoc = doc;
        rects = svgDoc.getElementsByTagName("rect");
        [].slice.call(rects).forEach(function(rect){
            rect.onmouseover = new Function("this.setAttribute('opacity', '0.75'); this.style='cursor: pointer';");
            rect.onmouseout = new Function("this.setAttribute('opacity','1)'); this.style='cursor: default';");
            rect.onclick = new Function("alert('Finger weg von ' + this.id + '!!!');");
        });
    };
        
    this.zoomOut = function(){
        scale_tmp = scaleLevel;
        scaleLevel -= scaleAmp;
        
        xPos = -(scale_tmp-scaleLevel)*getCenter()[0];
        yPos = -(scale_tmp-scaleLevel)*getCenter()[1];
        xPos /= 3.54;
        yPos /= 3.54;
        
        transform();
    };
    this.zoomIn = function(){
        scale_tmp = scaleLevel;
        scaleLevel += scaleAmp;
        
        xPos = -(scale_tmp-scaleLevel)*getCenter()[0];
        yPos = -(scale_tmp-scaleLevel)*getCenter()[1];
        xPos /= 3.54;
        yPos /= 3.54;
        
        transform();
    };
    this.moveLeft = function(){
        xPos += movAmp;
        transform();
    };
    this.moveRight = function(){
        xPos -= movAmp;
        transform();
    };
    this.moveUp = function(){
        yPos += movAmp;
        transform();
    };
    this.moveDown = function(){
        yPos -= movAmp;
        transform();
    };
    
    //# Private Methods
    var transform = function(){
        svgDoc.setAttribute("transform", "translate(" + xPos + "," + yPos + ")scale(" + scaleLevel + "," + scaleLevel + ")");
    };
    
    var getCenter = function(){
        var width = svgDoc.getBBox().width;
        var height = svgDoc.getBBox().height;
        
        return [width / 2 + xPos, height/2 + yPos];
    };
}