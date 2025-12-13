const WebSocket = require('ws');

const PORT = process.env.PORT || 8080;
const wss = new WebSocket.Server({ port: PORT });

wss.on('connection', ws => {
  ws.on('message', msg => {
    const data = JSON.parse(msg);
    const message = JSON.stringify({
      user: data.user || "Anon",
      message: data.message,
      time: Date.now()
    });
    // Broadcast to all clients
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });
});

console.log(`OASIS Chat server running on port ${PORT}`);
