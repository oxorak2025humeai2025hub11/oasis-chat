// Import WebSocket library
const WebSocket = require('ws');

// Port comes from environment (Railway sets it automatically)
const PORT = process.env.PORT || 8080;

// Create WebSocket server
const wss = new WebSocket.Server({ port: PORT });

wss.on('connection', ws => {
  console.log('A user connected.');

  // When a message is received from any client
  ws.on('message', message => {
    console.log('Received:', message.toString());

    // Broadcast the message to all connected clients
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message.toString());
      }
    });
  });

  // When a user disconnects
  ws.on('close', () => {
    console.log('A user disconnected.');
  });
});

console.log(`OASIS Chat server running on port ${PORT}`);
