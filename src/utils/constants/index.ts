// File Constants
export const FILE_CONSTANTS = {
    ALLOWED_TYPES: ['.txt', '.json', '.csv', '.xml', '.yaml', '.yml', '.md'],
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    UPLOAD_DIRECTORY: 'storage/uploads',
    BACKUP_DIRECTORY: 'storage/backups',
    TEMP_DIRECTORY: 'storage/temp'
};

// API Constants
export const API_CONSTANTS = {
    VERSION: '1.0.0',
    DEFAULT_TIMEOUT: 30000,
    RATE_LIMIT: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100 // limit each IP to 100 requests per windowMs
    }
};

// System Constants
export const SYSTEM_CONSTANTS = {
    CHECK_INTERVAL: 60000, // 1 minute
    MEMORY_THRESHOLD: 0.9, // 90%
    CPU_THRESHOLD: 0.8, // 80%
    DISK_THRESHOLD: 0.9 // 90%
};

// Python Constants
export const PYTHON_CONSTANTS = {
    SCRIPTS_DIRECTORY: 'src/services/python/scripts',
    DEFAULT_TIMEOUT: 30000,
    MAX_BUFFER: 1024 * 1024 * 10 // 10MB
};

// Cache Constants
export const CACHE_CONSTANTS = {
    DEFAULT_TTL: 3600, // 1 hour
    MAX_SIZE: 100, // Maximum number of items in cache
    CHECK_PERIOD: 600 // Cleanup every 10 minutes
};

// Error Constants
export const ERROR_CODES = {
    FILE_NOT_FOUND: 'FILE_NOT_FOUND',
    INVALID_FILE_TYPE: 'INVALID_FILE_TYPE',
    FILE_TOO_LARGE: 'FILE_TOO_LARGE',
    DIRECTORY_NOT_FOUND: 'DIRECTORY_NOT_FOUND',
    PYTHON_EXECUTION_ERROR: 'PYTHON_EXECUTION_ERROR',
    SYSTEM_ERROR: 'SYSTEM_ERROR',
    VALIDATION_ERROR: 'VALIDATION_ERROR'
};

// Regex Patterns
export const REGEX_PATTERNS = {
    FILENAME: /^[a-zA-Z0-9_-]+\.[a-zA-Z0-9]+$/,
    PATH_TRAVERSAL: /\.\./,
    PYTHON_SCRIPT: /^[a-zA-Z0-9_]+\.py$/
}; 