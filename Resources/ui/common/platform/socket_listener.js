function sock_listen() {
	var isBlackberry = Titanium.Platform.name === 'blackberry';
	var scaleX = 1;
	var scaleY = 1;
	if (isBlackberry) {
		scaleX += 1;
		scaleY += 2;
	};
	var win = Titanium.UI.createWindow();
	
	var connectedSockets = [];
	
	function removeSocket(sock) {
		var index = connectedSockets.indexOf(sock);
		if (index != -1) {
			connectedSockets.splice(index,1);
		}	
	}
	
	function pumpCallback(e) {
		if (e.bytesProcessed == -1) { // EOF
			readLabel.text = "<EOF> - Closing the remote socket!";
			e.source.close();
			removeSocket(e.source);
		}
		else if (e.errorDescription == null || e.errorDescription == "") {
			readLabel.text = "DATA: "+e.buffer.toString();
		}
		else {
			readLabel.text = "READ ERROR: "+e.errorDescription;
		}
	}
	
	var acceptedCallbacks = {
		error : function(e) {
			Ti.UI.createAlertDialog({
				title:"Socket error: "+e.socket.host,
				message:e.error
			}).show();
			removeSocket(e.socket);
		}
	};
	
	var socket = Titanium.Network.Socket.createTCP({
		port:40404,
		accepted: function(e) {
			var sock = e.inbound;
			connectedSockets.push(sock);
			messageLabel.text = 'ACCEPTED: '+sock.host+':'+sock.port;
			Ti.Stream.pump(sock, pumpCallback, 1024, true);
			socket.accept(acceptedCallbacks);
		},
		closed: function(e) {
			messageLabel.text = "Closed listener";
		},
		error: function(e) {
			Ti.UI.createAlertDialog({
				title:"Listener error: "+e.errorCode,
				message:e.error
			}).show();
		}
	});
	
	if (!isBlackberry) {
		socket.host = Ti.Platform.address;
	}
	var messageLabel = Titanium.UI.createLabel({
		text:'Socket messages',
		font:{fontSize:14},
		color:'#777',
		top:220 * scaleY,
		left:10 * scaleX
	});
	win.add(messageLabel);
	
	var readLabel = Titanium.UI.createLabel({
		text:'Read data',
		font:{fontSize:14},
		color:'#777',
		top:250 * scaleY,
		left:10 * scaleX,
		width:400 * scaleX
	});
	win.add(readLabel);
	
	var connectButton = Titanium.UI.createButton({
		title:'Listen on 40404',
		width:200 * scaleX,
		height:40 * scaleY,
		top:10 * scaleY
	});
	win.add(connectButton);
	connectButton.addEventListener('click', function() {
		try {
			socket.listen();
			messageLabel.text = "Listening on "+socket.host+":"+socket.port;
			socket.accept(acceptedCallbacks);
		} catch (e) {
			messageLabel.text = 'Exception: '+e;
		}
	});
	
	var closeButton = Titanium.UI.createButton({
		title:'Close',
		width:200 * scaleX,
		height:40 * scaleY,
		top:60 * scaleY
	});
	win.add(closeButton);
	closeButton.addEventListener('click', function() {
		try {
			socket.close();
			for (var index in connectedSockets) {
				try {
					var sock = connectedSockts[index];
					sock.close();
				}
				catch (e) {
					messageLabel.text = "Exception: " +e;
				}
			}
			messageLabel.text = 'Closed socket';
		} catch (e) {
			messageLabel.text = 'Exception: '+e;
		}
	});
	
	var stateButton = Titanium.UI.createButton({
		title:'Socket state',
		width:200 * scaleX,
		height:40 * scaleY,
		top:110 * scaleY
	});
	win.add(stateButton);
	stateButton.addEventListener('click', function() {
		var stateString = "UNKNOWN";
		switch (socket.state) {
			case Ti.Network.Socket.INITIALIZED:
				stateString = "INITIALIZED";
				break;
			case Ti.Network.Socket.CONNECTED:
				stateString = "CONNECTED";
				break;
			case Ti.Network.Socket.LISTENING:
				stateString = "LISTENING";
				break;
			case Ti.Network.Socket.CLOSED:
				stateString = "CLOSED";
				break;
			case Ti.Network.Socket.ERROR:
				stateString = "ERROR";
				break;
		}
		messageLabel.text = "State: "+stateString;
	});
	
	var writeButton = Titanium.UI.createButton({
		title:"Write 'Paradise Lost'",
		width:200 * scaleX,
		height:40 * scaleY,
		top:160 * scaleY
	});
	win.add(writeButton);
	writeButton.addEventListener('click', function() {
		var plBlob = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory, 'paradise_lost.txt').read();
		var input = Ti.Stream.createStream({source:plBlob, mode:Ti.Stream.MODE_READ});
		for (var index in connectedSockets) {
			var sock = connectedSockets[index];
			Ti.Stream.writeStream(input, sock, 4096);
		}
		messageLabel.text = "I'm a writer!";
	});
	
	// Cleanup
	win.addEventListener('close', function(e) {
		try {
			socket.close();
		}
		catch (e) {
			// Don't care about exceptions; just means the socket was already closed
		}
		for (var index in connectedSockets) {
			try {
				var sock = connectedSockets[index];
				sock.close();
			}
			catch (e) {
				// See above
			}
		}
	});
	if (isBlackberry) {
		writeButton.enabled = false;
	}
	
	return win;
};

module.exports = sock_listen;
