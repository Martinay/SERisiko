//@TODO clean up and restruckture
var WebSocketApi = function(address, host, port) {
      port = port || 8080;
      address = address || '';
      host = host || document.location.hostname;
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

        ws.send( JSON.stringify(message) );

    };   
    return ws;
};


//client Api
var RisikoApi = function() {
    //apiServer settings    
    var host = document.location.hostname;
    var port = 8080;
        
    var socket = new WebSocketApi('/websocket', host, port);
    
    
    socket.joinServer = function(playerName){
        socket.call("joinServer", playerName);
    };
    
    socket.joinLobby = function(){
        socket.call("joinLobby");
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
    socket.createGame = function(gameName, maxPlayers) {
        socket.call("createGame", gameName, maxPlayers);
    };
    socket.startGame = function() {
        socket.call("startGame");
    };
    
    socket.listOpenGames = function() {
        socket.call("listOpenGames");
    };    
    socket.listPlayers = function() {
        socket.call("listPlayers");
    }; 
    
    
    socket.attack = function(source, target, value) {
        socket.call("attack", source, target, value);
    }; 
    socket.move = function(source, target, value) {
        socket.call("move", source, target, value);
    }; 
    socket.set = function(target, value) {
        socket.call("set", target, value);
    }; 
    socket.endTurn = function() {
        socket.call("endTurn");
    }; 
    
    return socket;
};