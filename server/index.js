const express = require('express');
const expressWs = require('express-ws');
const helmet = require('helmet');
const path = require('path');

// ENV config
require('dotenv').config({ path: path.join(__dirname, './.env') });

// Environment vars and defaults
const { PORT = 3001 } = process.env;

// Setup Express
const app = express();
app.use(helmet());

// Setup Websocket
expressWs(app);

// Serve static react front-end
app.use(express.static(path.join(__dirname, '../client/build')));

// websocket route
const ws = require(path.join(__dirname, './routes/ws'));
app.use(ws);

// Get request wildcard, send index.html to allow react router routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// 404 all undefined endpoints and methods that aren't GET
app.all('*', (req, res) => {
  res.sendStatus(404);
});

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});