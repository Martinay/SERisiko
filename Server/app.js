var app = require('http').createServer(handler),
    io = require('socket.io').listen(app),
    fs = require('fs');

app.listen(80);

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
      if (err) {
          res.writeHead(500);
          return res.end('Error loading index.html');
      }

      res.writeHead(200);
    res.end(data);
  });
}

io.sockets.on('connection', function(socket) {

    socket.on('GetRealmList', function() {
        socket.emit('GetRealmListResponse', { realms: realms });
    });
    socket.on('GetPlayerList', function() {
        socket.emit('GetPlayerListResponse', { players: players });
    });
    socket.on('AddNewPlayer', function(player) {
        players.push(player);
    });
    socket.on('AddNewRealm', function(realm) {
        realms.push(realm);
    });
    socket.on('AddNewPlayerToRealm', function(data) {
        var realm;
        for (var i = 0; i < realms.length; i++) {
            if (realms[i].Guid === data.realmGuid) {
                realm = realms[i];
                break;
            }
            }
        var player;
        for (i = 0; i < players.length; i++) {
            if (players[i].Guid === data.playerGuid) {
                player = players[i];
                break;
            }
            }
        realm.realm.Players.push(player.playerName);
    });
});

var players = [];
var realms = [];