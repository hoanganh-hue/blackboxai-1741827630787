
require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const setupRoutes = require('./routes');
const AdvancedLogger = require('./utils/AdvancedLogger');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const logger = new AdvancedLogger();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup routes
setupRoutes(app);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});