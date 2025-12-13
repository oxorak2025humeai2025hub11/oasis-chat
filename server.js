const express = require('express');
const path = require('path');
const WebSocket = require('ws');

const app = express();
const PORT = process.env.PORT || 10000;

// Serve HTML and static files
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public/index.html')));

// Start HTTP server
const server = app.listen(PORT, () => console.log(`OASIS Chat server running on port ${PORT}`));

// WebSocket server
const wss = new WebSocket.Server({ server });

wss.on('connection', ws => {
  ws.on('message', msg => {
    let data;
    try {
      data = JSON.parse(msg); // { user, message }
    } catch {
      data = { user: "Anon", message: msg.toString() };
    }

    const message = {
      user: data.user || "Anon",
      message: data.message,
      time: Date.now()
    };

    // Broadcast to all connected clients
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  });
});
