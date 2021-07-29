const express = require('express');
const router = express.Router();

// Environment vars and defaults
const { MAX_ROOMS = 20 } = process.env;

// Stores room data
let rooms = {};
// Websocket endpoint, room id parameter
router.ws('/:id', (ws, req) => {
  const { id } = req.params;
  // Allow user to be set by first message
  let user = null;
  // Check if room exists
  if (rooms[id]) {
    ws.send(JSON.stringify({ message: `Room exists. Identifier: ${id}` }));
  }
  else {
    // Check if max rooms reached
    if (Object.keys(rooms).length !== parseInt(MAX_ROOMS)) {
      // Add room to memory
      rooms = {
        ...rooms,
        [id]: { messages: [], clients: [] }
      }
      ws.send(JSON.stringify({ message: `Room created. Identifier: ${id}` }))
    }
    // Max rooms already reached
    else {
      ws.send(JSON.stringify({ error: 'Maximum number of rooms reached' }));
      ws.close();
    }
  }

  const room = rooms[id];
  // Push client socket to room.clients and store index
  const clientIndex = room.clients.push(ws) - 1;

  // Message handler
  ws.on('message', msg => {
    // First message is username
    if (user === null) {
      user = msg
    }
    // Push message to messages array and send list back
    else {
      room.messages.push({ user, message: msg });
      ws.send(JSON.stringify(room.messages));
    }
  });

  ws.on('close', () => {
    // Make sure room exists
    if (room) {
      // Remove client from room
      room.clients.splice(clientIndex, 1);
      // If room has no clients, remove it from memory
      if (room.clients.length === 0) {
        delete rooms[id];
      }
    }
  })
});

module.exports = router;