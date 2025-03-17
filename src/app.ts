import express from 'express';
import fileRoutes from './api/routes/fileRoutes';
import dataRoutes from './api/routes/dataRoutes';
import systemRoutes from './api/routes/systemRoutes';
import chatRoutes from './api/routes/chatRoutes';
import commandRoutes from './api/routes/commandRoutes';
import processRoutes from './api/routes/processRoutes';
import backupRoutes from './api/routes/backupRoutes';
import { requestLogger, errorHandler, notFoundHandler, responseFormatter } from './api/middleware';
import config from './config';
import winston from 'winston';

const app = express();
const logger = winston.createLogger({
    level: config.logger.level,
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ 
            filename: `${config.storage.logsDir}/error.log`, 
            level: 'error' 
        }),
        new winston.transports.File({ 
            filename: `${config.storage.logsDir}/combined.log` 
        })
    ]
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
}

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);
app.use(responseFormatter);

// Routes
app.use('/api/files', fileRoutes);
app.use('/api/data', dataRoutes);
app.use('/api/system', systemRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/command', commandRoutes);
app.use('/api/process', processRoutes);
app.use('/api/backup', backupRoutes);

// API Documentation
app.get('/api/docs', (req, res) => {
    res.json({
        version: '1.0.0',
        endpoints: {
            system: {
                base: '/api/system',
                routes: [
                    { method: 'GET', path: '/status', description: 'Get system status' },
                    { method: 'GET', path: '/info', description: 'Get system information' },
                    { method: 'GET', path: '/metrics', description: 'Get system metrics' }
                ]
            },
            files: {
                base: '/api/files',
                routes: [
                    { method: 'GET', path: '/list', description: 'List all files' },
                    { method: 'POST', path: '/upload', description: 'Upload a file' },
                    { method: 'GET', path: '/info/:filename', description: 'Get file information' },
                    { method: 'GET', path: '/download/:filename', description: 'Download a file' },
                    { method: 'DELETE', path: '/:filename', description: 'Delete a file' }
                ]
            },
            data: {
                base: '/api/data',
                routes: [
                    { method: 'POST', path: '/analyze', description: 'Analyze file content' },
                    { method: 'POST', path: '/scan', description: 'Scan directory for files' }
                ]
            },
            command: {
                base: '/api/command',
                routes: [
                    { method: 'POST', path: '/execute', description: 'Execute a system command' },
                    { method: 'GET', path: '/history', description: 'Get command execution history' }
                ]
            },
            process: {
                base: '/api/process',
                routes: [
                    { method: 'GET', path: '/', description: 'List all processes' },
                    { method: 'GET', path: '/:pid', description: 'Get process information' },
                    { method: 'DELETE', path: '/:pid', description: 'Kill a process' }
                ]
            },
            backup: {
                base: '/api/backup',
                routes: [
                    { method: 'POST', path: '/', description: 'Create a new backup' },
                    { method: 'GET', path: '/', description: 'List all backups' },
                    { method: 'GET', path: '/:fileName', description: 'Download a backup' },
                    { method: 'DELETE', path: '/:fileName', description: 'Delete a backup' }
                ]
            }
        }
    });
});

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
const port = config.server.port;
let retries = 0;
const maxRetries = 5;

interface ServerError extends Error {
    code?: string;
}

async function startServer() {
    try {
        app.listen(port, () => {
            logger.info(`Server is running on port ${port}`);
        });
    } catch (error) {
        const serverError = error as ServerError;
        if (serverError.code === 'EADDRINUSE' && retries < maxRetries) {
            retries++;
            logger.warn(`Port ${port} is in use, retrying in 5 seconds... (${retries}/${maxRetries})`);
            await new Promise(resolve => setTimeout(resolve, 5000));
            await startServer();
        } else {
            logger.error('Failed to start server:', serverError);
            process.exit(1);
        }
    }
}

// Handle process termination
process.on('SIGTERM', () => {
    logger.info('SIGTERM received. Shutting down gracefully...');
    process.exit(0);
});

process.on('uncaughtException', (error: Error) => {
    logger.error('Uncaught Exception:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

startServer();