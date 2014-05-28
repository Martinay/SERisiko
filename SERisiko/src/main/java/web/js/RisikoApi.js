

var WebSocketApi = function(address, port, host) {
    
      port = port || 8080;
      address = address || '';
      host = host || document.location.host;
      
    var ws = new WebSocket('ws://' + host + ':'+port+address);
      
    ws.onopen = function() { 
        console.log("Connected");
    };

    ws.onclose = function() { 
        console.log("Disconnected"); 
    };


    //add some new methods
    ws.call = function() {
        var args = [];
        for (var i = 1; i < arguments.length; i++) {            
            args[i-1] = arguments[i];
        }

        var message = {
            "name": arguments[0],
            "args": args
        };
        console.log(message);
        ws.send( JSON.stringify(message) );

    };   
    return ws;
};


//client Api
var RisikoApi = function() {
    
    var socket = new WebSocketApi('/websocket', 80);
    
    socket.joinLobby = function(playerName){
        socket.call("joinLobby", playerName);
    };
    
    socket.leaveLobby = function() {
        socket.call("leaveLobby");
    };
    socket.joinGame = function(gameNumber) {
        socket.call("joinGame", gameNumber);
    };
    socket.leaveGame = function() {
        socket.call("leaveGame");
    };
    socket.createGame = function() {
        socket.call("createGame");
    };
    socket.createGame = function() {
        socket.call("startGame");
    };
    
    return socket;
};



//example
var connection;

$(function() {
    connection = new RisikoApi();
    connection.onmessage = function(elem) { //get message from server
        console.log( elem );
        $('#message').append(elem.data);
    };
});