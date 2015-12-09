var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Match = require('./game/match');
var Player = require('./game/player');

var findingMatch = [];
var matches = [];

io.on('connection', function(socket) {
    
    socket.on('add player', function(playerName) {
        console.log('player joined lobby: ' + playerName);
        socket.player = new Player(playerName);
        socket.join('lobby');
        socket.emit('login', socket.player);
        io.sockets.in('lobby').emit('player joined', socket.player);
    });
    
    socket.on('new message', function(message) {
        console.log(socket.player.name + ': ' + message);
        var data = {
            player: socket.player,
            message: message
        };
        io.sockets.in('lobby').emit('new message', data);
    });
    
    socket.on('find match', function(player) {
        console.log(socket.player.name + ' is finding a match');
        findingMatch.push(player);
        if (findingMatch.length > 1) {
            var p1 = findingMatch.pop();
            var p2 = findingMatch.pop();
            var newMatch = new Match(p1, p2);
            matches.push(newMatch);
            console.log('found match for %s and %s', p1.name, p2.name);
            io.sockets.in('lobby').emit('found match', newMatch);
        }
    });
    
    socket.on('attack', function(data) {
        var match = getMatch(data.matchId);
        if (match.p1.id === data.playerId) {
            match.p2.character.health -= data.damage;
            console.log('player %s attacked player %s for %s damage', match.p1.name, match.p2.name, data.damage);
            if (match.p2.character.health <= 0) {
                match.p2.character.health = 0;
                match.inProgress = false;
                match.winner = match.p1;
                match.loser = match.p2;
                console.log('match end, player %s wins, player %s loses', match.p1.name, match.p2.name);
            }
        } else if (match.p2.id === data.playerId) {
            match.p1.character.health -= data.damage;
            console.log('player %s attacked player %s for %s damage', match.p2.name, match.p1.name, data.damage);
            if (match.p1.character.health <= 0) {
                match.p1.character.health = 0;
                match.inProgress = false;
                match.winner = match.p2;
                match.loser = match.p1;
                console.log('match end, player %s wins, player %s loses', match.p2.name, match.p1.name);
            }
        }
        io.sockets.in('lobby').emit('match update', match);
    });
    
    function getMatch(id) {
        var match;
        matches.some(function(_match) {
            if (id === _match.id) {
                match = _match;
                return;
            }
        });
        return match;
    }
    
    socket.on('disconnect', function() {
        console.log('socket disconnect');
        io.sockets.in('lobby').emit('player left', socket.player);
    });
    
    socket.on('error', function() {
        console.error('socket error');
    });
});


app.use(express.static(__dirname + '/client'));
app.use(express.static(__dirname + '/node_modules'));
app.use(express.static(__dirname + '/bower_components'));

app.get('*', function(req, res) {
    res.sendFile('index.html', { root: __dirname + '/client' });
});

http.listen(1337, function() {
    console.log('Listening on port 1337');
});