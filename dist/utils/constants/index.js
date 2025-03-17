"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.REGEX_PATTERNS = exports.ERROR_CODES = exports.CACHE_CONSTANTS = exports.PYTHON_CONSTANTS = exports.SYSTEM_CONSTANTS = exports.API_CONSTANTS = exports.FILE_CONSTANTS = void 0;
// File Constants
exports.FILE_CONSTANTS = {
    ALLOWED_TYPES: ['.txt', '.json', '.csv', '.xml', '.yaml', '.yml', '.md'],
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    UPLOAD_DIRECTORY: 'storage/uploads',
    BACKUP_DIRECTORY: 'storage/backups',
    TEMP_DIRECTORY: 'storage/temp'
};
// API Constants
exports.API_CONSTANTS = {
    VERSION: '1.0.0',
    DEFAULT_TIMEOUT: 30000,
    RATE_LIMIT: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100 // limit each IP to 100 requests per windowMs
    }
};
// System Constants
exports.SYSTEM_CONSTANTS = {
    CHECK_INTERVAL: 60000, // 1 minute
    MEMORY_THRESHOLD: 0.9, // 90%
    CPU_THRESHOLD: 0.8, // 80%
    DISK_THRESHOLD: 0.9 // 90%
};
// Python Constants
exports.PYTHON_CONSTANTS = {
    SCRIPTS_DIRECTORY: 'src/services/python/scripts',
    DEFAULT_TIMEOUT: 30000,
    MAX_BUFFER: 1024 * 1024 * 10 // 10MB
};
// Cache Constants
exports.CACHE_CONSTANTS = {
    DEFAULT_TTL: 3600, // 1 hour
    MAX_SIZE: 100, // Maximum number of items in cache
    CHECK_PERIOD: 600 // Cleanup every 10 minutes
};
// Error Constants
exports.ERROR_CODES = {
    FILE_NOT_FOUND: 'FILE_NOT_FOUND',
    INVALID_FILE_TYPE: 'INVALID_FILE_TYPE',
    FILE_TOO_LARGE: 'FILE_TOO_LARGE',
    DIRECTORY_NOT_FOUND: 'DIRECTORY_NOT_FOUND',
    PYTHON_EXECUTION_ERROR: 'PYTHON_EXECUTION_ERROR',
    SYSTEM_ERROR: 'SYSTEM_ERROR',
    VALIDATION_ERROR: 'VALIDATION_ERROR'
};
// Regex Patterns
exports.REGEX_PATTERNS = {
    FILENAME: /^[a-zA-Z0-9_-]+\.[a-zA-Z0-9]+$/,
    PATH_TRAVERSAL: /\.\./,
    PYTHON_SCRIPT: /^[a-zA-Z0-9_]+\.py$/
};
//# sourceMappingURL=index.js.map