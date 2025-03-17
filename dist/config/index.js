"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load environment variables
dotenv_1.default.config();
const config = {
    env: process.env.NODE_ENV || 'development',
    server: {
        port: process.env.PORT || 3000,
        host: process.env.HOST || 'localhost',
        cors: {
            origin: process.env.CORS_ORIGIN || '*',
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
        }
    },
    // File storage configuration
    storage: {
        uploadDir: process.env.UPLOAD_DIR || path_1.default.join(__dirname, '../uploads'),
        backupDir: process.env.BACKUP_DIR || path_1.default.join(__dirname, '../backups'),
        logsDir: process.env.LOGS_DIR || path_1.default.join(__dirname, '../logs'),
        tempDir: process.env.TEMP_DIR || path_1.default.join(__dirname, '../temp'),
        maxFileSize: 100 * 1024 * 1024, // 100MB
        allowedTypes: ['.txt', '.json', '.yaml', '.yml', '.csv', '.md', '.js', '.py', '.html']
    },
    // Python configuration
    python: {
        path: process.env.PYTHON_PATH || 'python3',
        scriptsDir: process.env.PYTHON_SCRIPTS_DIR || path_1.default.join(__dirname, '../python'),
        virtualEnv: process.env.PYTHON_VENV,
        requirements: ['numpy', 'pandas', 'matplotlib', 'scikit-learn']
    },
    // WebSocket configuration
    websocket: {
        path: '/ws',
        pingInterval: 30000,
        pingTimeout: 5000
    },
    // Monitoring configuration
    monitoring: {
        interval: parseInt(process.env.MONITORING_INTERVAL || '5000', 10),
        enabled: process.env.MONITORING_ENABLED === 'true'
    },
    // Cache configuration
    cache: {
        enabled: process.env.CACHE_ENABLED === 'true',
        ttl: parseInt(process.env.CACHE_TTL || '3600', 10)
    },
    // Security configuration
    security: {
        rateLimiting: {
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 100 // limit each IP to 100 requests per windowMs
        },
        helmet: {
            contentSecurityPolicy: {
                directives: {
                    defaultSrc: ["'self'"],
                    scriptSrc: ["'self'", "'unsafe-inline'"],
                    styleSrc: ["'self'", "'unsafe-inline'"],
                    imgSrc: ["'self'", 'data:', 'https:'],
                }
            }
        }
    },
    // Logger configuration
    logger: {
        level: process.env.LOG_LEVEL || 'debug',
        format: process.env.LOG_FORMAT || 'json'
    },
    openai: {
        apiKey: process.env.OPENAI_API_KEY
    }
};
exports.default = config;
//# sourceMappingURL=index.js.map