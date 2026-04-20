const express = require('express');
const WebSocket = require('ws');
const http = require('http');

const PORT = process.env.PORT || 3055;

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Middleware
app.use(express.json());

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'WebSocket server is running', port: PORT });
});

// WebSocket connection handler
wss.on('connection', (ws) => {
  console.log('✅ Client connected to WebSocket');

  // Send initial connection message
  ws.send(JSON.stringify({
    type: 'connection',
    message: 'Connected to Figma MCP WebSocket Server',
    timestamp: new Date().toISOString(),
  }));

  // Handle incoming messages
  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data);
      console.log('📨 Received message:', message);

      // Echo the message back (can be extended with Figma API calls)
      ws.send(JSON.stringify({
        type: 'response',
        original: message,
        timestamp: new Date().toISOString(),
      }));
    } catch (error) {
      console.error('❌ Error parsing message:', error);
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Invalid message format',
      }));
    }
  });

  // Handle errors
  ws.on('error', (error) => {
    console.error('❌ WebSocket error:', error);
  });

  // Handle disconnection
  ws.on('close', () => {
    console.log('👋 Client disconnected');
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`\n🚀 Figma MCP WebSocket Server running on port ${PORT}`);
  console.log(`📡 WebSocket: ws://localhost:${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health\n`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n⏹️  Shutting down server...');
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.close();
    }
  });
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});
