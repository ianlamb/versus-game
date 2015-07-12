(function() {
	var socket;
	var username;
	var character;
	var state;
  	var connected = false;
	  
	$('#chat').hide();
	$('#game').hide();
	
	$(document).ready(function() {
		$('#connectModal').modal();
	});
	
	$(document).on('click', '[data-action="send"]', function() {
		var message = $('#message').val();
		$('#message').val('');
		addMessage(username + ': ' + message);
		socket.emit('new message', message);
	});
	
	$(document).on('click', '[data-action="play"]', function() {
		addMessage('finding match...');
		socket.emit('find match', username);
	});
	
	$(document).on('click', '[data-action="connect"]', function() {
		username = $('#username').val();
		if (!username) {
			return;
		}
		
		socket = io();
		
		socket.on('connect', function() {
			socket.emit('add user', username);
		});
		
		socket.on('login', function(data) {
			$('#connectModal').modal('hide');
			connected = true;
			character = data.character;
			$('#user').html(username);
			$('#character').html(character.name);
			$('#chat').show();
			$('#game').show();
			addMessage('joined lobby');
		});
		
		socket.on('user joined', function(data) {
			addMessage('user joined: ' + data);
		});
		
		socket.on('user left', function(data) {
			addMessage('user left: ' + data);
		});
		
		socket.on('new message', function(data) {
			addMessage(data.user + ': ' + data.message);
		});
	});
	
	function addMessage(msg) {
		$('#messages').append('<li>' + msg + '</li>');
	}
})();