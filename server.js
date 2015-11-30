var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var testCharacter = {
    "name": "Uther",
    "level": 1,
    "xp": 0,
    "health": 100,
    "damage": 10
}

var findingMatch = [];


io.on('connection', function(socket) {
    
    socket.on('add user', function(username) {
        console.log('user joined lobby: ' + username);
        socket.username = username;
        socket.join('lobby');
        socket.emit('login', { characters: [testCharacter] });
        socket.to('lobby').emit('user joined', username);
    });
    
    socket.on('new message', function(message) {
        console.log(socket.username + ': ' + message);
        var data = {
            user: socket.username,
            message: message
        }
        socket.to('lobby').emit('new message', data);
    });
    
    socket.on('find match', function(username) {
        findingMatch.push(username);
        if (findingMatch.length > 1) {
            console.log('found match!');
            var user1 = findingMatch.pop();
            var user2 = findingMatch.pop();
            socket.to('lobby').emit('')
        }
    });
    
    socket.on('disconnect', function() {
        console.log('socket disconnect');
        socket.to('lobby').emit('user left', socket.username);
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