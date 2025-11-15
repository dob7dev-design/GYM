function createChatServer(wss) {
	
	console.log('Chat service is running...');
	wss.on('connection', (ws) => {
		console.log('A new client connected to the chat');
		ws.on('message', (message) => {
			console.log('Received message : ', message.toString());
			wss.clients.forEach((client) => {
				if(client !== ws && client.readyState === ws.OPEN) {
					client.send(message.toString());
				}
			});
		});
		ws.on('close', () => {
			console.log('Client disconnected');
		});
		ws.send('Welcome to the gym chat!');
	});
}

module.exports = createChatServer;
