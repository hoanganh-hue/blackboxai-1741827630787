const WebSocket = require('ws');
const logger = require('./logger');

class WebSocketManager {
    constructor(server) {
        this.wss = new WebSocket.Server({ server });
        this.clients = new Map();
        this.setupWebSocket();
    }

    setupWebSocket() {
        this.wss.on('connection', (ws, req) => {
            const clientId = Date.now().toString();
            this.clients.set(clientId, ws);

            logger.info(`WebSocket client connected: ${clientId}`);

            ws.on('message', (message) => {
                try {
                    const data = JSON.parse(message);
                    this.handleMessage(clientId, data);
                } catch (error) {
                    logger.error(`Invalid message from client ${clientId}:`, error);
                }
            });

            ws.on('close', () => {
                this.clients.delete(clientId);
                logger.info(`WebSocket client disconnected: ${clientId}`);
            });

            ws.on('error', (error) => {
                logger.error(`WebSocket error for client ${clientId}:`, error);
            });

            // Gửi ID cho client
            ws.send(JSON.stringify({
                type: 'connection',
                clientId
            }));
        });
    }

    handleMessage(clientId, data) {
        switch (data.type) {
            case 'subscribe':
                this.handleSubscribe(clientId, data);
                break;
            case 'unsubscribe':
                this.handleUnsubscribe(clientId, data);
                break;
            default:
                logger.warn(`Unknown message type from client ${clientId}:`, data.type);
        }
    }

    handleSubscribe(clientId, data) {
        const ws = this.clients.get(clientId);
        if (ws) {
            ws.commandSubscriptions = ws.commandSubscriptions || new Set();
            ws.commandSubscriptions.add(data.commandId);
            logger.info(`Client ${clientId} subscribed to command ${data.commandId}`);
        }
    }

    handleUnsubscribe(clientId, data) {
        const ws = this.clients.get(clientId);
        if (ws && ws.commandSubscriptions) {
            ws.commandSubscriptions.delete(data.commandId);
            logger.info(`Client ${clientId} unsubscribed from command ${data.commandId}`);
        }
    }

    broadcastCommandOutput(commandId, data) {
        this.clients.forEach((ws, clientId) => {
            if (ws.commandSubscriptions && ws.commandSubscriptions.has(commandId)) {
                ws.send(JSON.stringify({
                    type: 'commandOutput',
                    commandId,
                    ...data
                }));
            }
        });
    }

    broadcastCommandStatus(commandId, status) {
        this.clients.forEach((ws, clientId) => {
            if (ws.commandSubscriptions && ws.commandSubscriptions.has(commandId)) {
                ws.send(JSON.stringify({
                    type: 'commandStatus',
                    commandId,
                    status
                }));
            }
        });
    }

    broadcastSystemStatus(status) {
        this.clients.forEach((ws) => {
            ws.send(JSON.stringify({
                type: 'systemStatus',
                ...status
            }));
        });
    }
}

module.exports = WebSocketManager; 