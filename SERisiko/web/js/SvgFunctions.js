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
    
    //# Public Methods
    this.init = function(doc){
        scaleLevel = 1;
        scaleAmp = 0.1;
        movAmp = 50;
        xPos = 0;
        yPos = 0;
        
        svgDoc = doc;
        rects = svgDoc.getElementsByTagName("rect");
        [].slice.call(rects).forEach(function(rect){
            rect.onmouseover = new Function("this.setAttribute('opacity', '0.75'); this.style='cursor: pointer';");
            rect.onmouseout = new Function("this.setAttribute('opacity','1)'); this.style='cursor: default';");
            rect.onclick = new Function("alert('Finger weg von ' + this.id + '!!!');");
        });
    };
        
    this.zoomOut = function(){
        var scale_tmp = scaleLevel;
        scaleLevel -= scaleAmp;
        
        xPos = -(scale_tmp-scaleLevel)*(getCenter()[0]/3.54);
        yPos = -(scale_tmp-scaleLevel)*(getCenter()[1]/3.54);
        
        transform();
        
        //svgSetScale(svgDoc, scaleLevel, scale_tmp);
    };
    this.zoomIn = function(){
        var scale_tmp = scaleLevel;
        scaleLevel += scaleAmp;
        
        xPos = -(scale_tmp-scaleLevel)*(getCenter()[0]/3.54);
        yPos = -(scale_tmp-scaleLevel)*(getCenter()[1]/3.54);
 
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
    
    /*
    function svgSetScale(svg, amount, oldAmount){ 
        var box = svg.getBBox(); 
        var cx = box.x + box.width/2; 
        var cy = box.y + box.height/2; 
        //$(element).attr("data-scale", amount); 
        
        svg.setAttribute("transform", "translate(" + cx + " " + cy + ") scale(" + amount + ") translate(" + (-cx) + " " + (-cy) + ")"); 
        
        var diffAmount = amount / oldAmount; 
        
        var scrollX = $('#svg-container').scrollLeft(); 
        var scrollY = $('#svg-container').scrollTop(); 
        var middle = getScrollCenter(); 
        
        var diffX = scrollX - middle[0]; 
        var diffY = scrollY - middle[1]; 
        
        var diffActualX = (diffAmount * diffX) - diffX; 
        var diffActualY = (diffAmount * diffY) - diffY; 
        
        $('#svg-container').scrollLeft(scrollX + diffActualX); 
        $('#svg-container').scrollTop(scrollY + diffActualY); 
    }*/


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