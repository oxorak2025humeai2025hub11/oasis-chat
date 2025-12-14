// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);

// Use Socket.IO for real-time chat
const io = new Server(server, {
  cors: {
    origin: "*", // You can restrict to your domain later
    methods: ["GET", "POST"]
  }
});

// Use Render's PORT environment variable, fallback to 10000 locally
const PORT = process.env.PORT || 10000;

// Serve static files from 'public' folder (your index.html, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Optional: simple route to verify server is running
app.get('/ping', (req, res) => {
  res.send('OASIS Chat server is alive!');
});

// Socket.IO chat handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Listen for chat messages from clients
  socket.on('chat message', (msg) => {
    console.log('Message received:', msg);
    // Broadcast message to all connected clients
    io.emit('chat message', msg);
  });

  // Log when a client disconnects
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`OASIS Chat server running on port ${PORT}`);
});
