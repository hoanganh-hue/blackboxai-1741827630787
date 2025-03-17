import { Request, Response, NextFunction } from 'express';
import { AppError, ApiResponse } from '@/types';
import config from '@/config';
import winston from 'winston';

// Khởi tạo logger
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

// Request logging middleware
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    
    res.on('finish', () => {
        const duration = Date.now() - start;
        logger.info({
            method: req.method,
            url: req.url,
            status: res.statusCode,
            duration: `${duration}ms`
        });
    });

    next();
};

// Error handling middleware
export const errorHandler = (err: AppError, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.statusCode || 500;
    const errorCode = err.code || 'INTERNAL_SERVER_ERROR';
    
    // Log error
    logger.error({
        message: err.message,
        code: errorCode,
        stack: err.stack,
        details: err.details
    });

    // Send error response
    const response: ApiResponse = {
        success: false,
        error: {
            message: err.message,
            code: errorCode,
            details: err.details
        }
    };

    res.status(statusCode).json(response);
};

// Not found middleware
export const notFoundHandler = (req: Request, res: Response) => {
    const response: ApiResponse = {
        success: false,
        error: {
            message: 'Resource not found',
            code: 'NOT_FOUND'
        }
    };

    res.status(404).json(response);
};

// Response formatter middleware
export const responseFormatter = (req: Request, res: Response, next: NextFunction) => {
    const originalJson = res.json;
    res.json = function (body: any) {
        if (body && !body.hasOwnProperty('success')) {
            body = {
                success: true,
                data: body
            };
        }
        return originalJson.call(this, body);
    };
    next();
}; 