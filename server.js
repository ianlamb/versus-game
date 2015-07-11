var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

io.on('connection', function(socket) {
    
    socket.on('register', function(id) {
        socket.join('lobby');
    });
    
    socket.on('disconnect', function() {
        console.log('socket disconnect');
    });
    
    socket.on('error', function() {
        console.error('socket error');
    });
});

app.get('/', function(req, res) {
    res.sendFile('index.html', { root: __dirname + '/client' });
});

app.use(express.static(__dirname + '/client'));

http.listen(1337, function() {
    console.log('Listening on port 1337');
});