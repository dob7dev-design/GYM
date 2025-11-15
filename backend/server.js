const http = require('http');

const express = require('express');
const { WebSocketServer } = require('ws');
const cors = require('cors');

require('dotenv').config();
const allRoutes = require('./src/routes');
const createChatServer = require('./src/services/chatService');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', allRoutes);

const server = http.createServer(app);

const wss = new WebSocketServer({ server });
createChatServer(wss);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
	console.log(`Server is running on the http://localhost:${PORT}`);
	console.log('API is available at /api');
	console.log('WebSocket server is also running on the same port');
});
