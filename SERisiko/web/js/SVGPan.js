// ---------------------- #

/**
 *
 * @author Alexander Santana Losada
 */

var zoomScale = 0.2;
var root = document.documentElement;
var zoomState = 0;
var state = 'none', svgRoot = null, stateTarget, stateOrigin, stateTf;

setupHandlers(root);

function setupHandlers(root){
    setAttributes(root, {
        "onmouseup" : "handleMouseUp(evt)",
        "onmousedown" : "handleMouseDown(evt)",
        "onmousemove" : "handleMouseMove(evt)",
    });

    if(navigator.userAgent.toLowerCase().indexOf('webkit') >= 0)
        window.addEventListener('mousewheel', handleMouseWheel, false); // Chrome/Safari
    else
        window.addEventListener('DOMMouseScroll', handleMouseWheel, false); // Others
}

/**
 * Retrieves the root element for SVG manipulation. The element is then cached into the svgRoot global variable.
 */
function getRoot(root) {
    if(svgRoot == null) {
        var r = root.getElementById("viewport") ? root.getElementById("viewport") : root.documentElement, t = r;
        while(t != root) {
            if(t.getAttribute("viewBox")) {
                setCTM(r, r.getCTM());
                t.removeAttribute("viewBox");
            }
            t = t.parentNode;
        }
        svgRoot = r;
    }
    return svgRoot;
}

/**
 * Instance an SVGPoint object with given event coordinates.
 */
function getEventPoint(evt) {
    var p = root.createSVGPoint();

    p.x = evt.clientX;
    p.y = evt.clientY;

    return p;
}

function setCTM(element, matrix) {    
    var s = "matrix(" + matrix.a + "," + matrix.b + "," + matrix.c + "," + matrix.d + "," + matrix.e + "," + matrix.f + ")";
    element.setAttribute("transform", s);
}
function setAttributes(element, attributes){
    for (var i in attributes)
        element.setAttributeNS(null, i, attributes[i]);
}

function handleMouseWheel(evt) {
    if(evt.preventDefault)
            evt.preventDefault();

    evt.returnValue = false;
    var svgDoc = evt.target.ownerDocument;

    var delta = evt.wheelDelta?delta = evt.wheelDelta/360:evt.detail/-9;
    var z = Math.pow(1 + zoomScale, delta); z = z < 1?0.9410360288810286:1.0626585691826111;
    var g = getRoot(svgDoc);
    var p = getEventPoint(evt);
    if ((z < 1 && zoomState >= 0) || (z > 1 && zoomState < -20))
        return;
    p = p.matrixTransform(g.getCTM().inverse());

    var k = root.createSVGMatrix().translate(p.x, p.y).scale(z).translate(-p.x, -p.y);
    setCTM(g, g.getCTM().multiply(k));

    if(typeof(stateTf) === "undefined")
            stateTf = g.getCTM().inverse();
    stateTf = stateTf.multiply(k.inverse());

    if(z < 1)
        zoomState++;
    else
        zoomState--;
}

function handleMouseMove(evt) {
    if(evt.preventDefault)
            evt.preventDefault();
    evt.returnValue = false;
    var svgDoc = evt.target.ownerDocument;
    var g = getRoot(svgDoc);
    
    if(state === 'pan') {
        var p = getEventPoint(evt).matrixTransform(stateTf);
        setCTM(g, stateTf.inverse().translate(p.x - stateOrigin.x, p.y - stateOrigin.y));
    }
}

function handleMouseDown(evt) {
    if(evt.preventDefault)
        evt.preventDefault();

    evt.returnValue = false;
    var svgDoc = evt.target.ownerDocument;
    var g = getRoot(svgDoc);

    state = 'pan';
    stateTf = g.getCTM().inverse();
    stateOrigin = getEventPoint(evt).matrixTransform(stateTf);
}

function handleMouseUp(evt) {
    if(evt.preventDefault)
            evt.preventDefault();
    evt.returnValue = false;

    if(state === 'pan') 
        state = '';
}

