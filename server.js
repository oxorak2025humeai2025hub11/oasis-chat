// server.js
const express = require("express");
const http = require("http");
const path = require("path");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Serve static files from 'public' folder
app.use(express.static(path.join(__dirname, "public")));

// Handle WebSocket connections
wss.on("connection", ws => {
  console.log("New client connected");

  ws.on("message", message => {
    try {
      const data = JSON.parse(message); // { user, message }
      const msg = { ...data, time: new Date() };

      // Broadcast message to all connected clients
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(msg));
        }
      });
    } catch (err) {
      console.error("Invalid message", err);
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

// Use PORT from environment (for Render), default to 10000
const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
  console.log(`OASIS Chat server running on port ${PORT}`);
});
