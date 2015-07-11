var express = require('express');
var app = express();
var http = require('http');
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

app.get('/', function(req, res){
    res.sendfile('index.html');
});

http.listen(1337, function() {
    console.log('Listening on port 1337');
});