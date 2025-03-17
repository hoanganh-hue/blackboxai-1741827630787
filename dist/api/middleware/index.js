"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseFormatter = exports.notFoundHandler = exports.errorHandler = exports.requestLogger = void 0;
const config_1 = __importDefault(require("@/config"));
const winston_1 = __importDefault(require("winston"));
// Khởi tạo logger
const logger = winston_1.default.createLogger({
    level: config_1.default.logger.level,
    format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.json()),
    transports: [
        new winston_1.default.transports.File({
            filename: `${config_1.default.storage.logsDir}/error.log`,
            level: 'error'
        }),
        new winston_1.default.transports.File({
            filename: `${config_1.default.storage.logsDir}/combined.log`
        })
    ]
});
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston_1.default.transports.Console({
        format: winston_1.default.format.simple()
    }));
}
// Request logging middleware
const requestLogger = (req, res, next) => {
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
exports.requestLogger = requestLogger;
// Error handling middleware
const errorHandler = (err, req, res, next) => {
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
    const response = {
        success: false,
        error: {
            message: err.message,
            code: errorCode,
            details: err.details
        }
    };
    res.status(statusCode).json(response);
};
exports.errorHandler = errorHandler;
// Not found middleware
const notFoundHandler = (req, res) => {
    const response = {
        success: false,
        error: {
            message: 'Resource not found',
            code: 'NOT_FOUND'
        }
    };
    res.status(404).json(response);
};
exports.notFoundHandler = notFoundHandler;
// Response formatter middleware
const responseFormatter = (req, res, next) => {
    const originalJson = res.json;
    res.json = function (body) {
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
exports.responseFormatter = responseFormatter;
//# sourceMappingURL=index.js.map