export declare const FILE_CONSTANTS: {
    ALLOWED_TYPES: string[];
    MAX_FILE_SIZE: number;
    UPLOAD_DIRECTORY: string;
    BACKUP_DIRECTORY: string;
    TEMP_DIRECTORY: string;
};
export declare const API_CONSTANTS: {
    VERSION: string;
    DEFAULT_TIMEOUT: number;
    RATE_LIMIT: {
        windowMs: number;
        max: number;
    };
};
export declare const SYSTEM_CONSTANTS: {
    CHECK_INTERVAL: number;
    MEMORY_THRESHOLD: number;
    CPU_THRESHOLD: number;
    DISK_THRESHOLD: number;
};
export declare const PYTHON_CONSTANTS: {
    SCRIPTS_DIRECTORY: string;
    DEFAULT_TIMEOUT: number;
    MAX_BUFFER: number;
};
export declare const CACHE_CONSTANTS: {
    DEFAULT_TTL: number;
    MAX_SIZE: number;
    CHECK_PERIOD: number;
};
export declare const ERROR_CODES: {
    FILE_NOT_FOUND: string;
    INVALID_FILE_TYPE: string;
    FILE_TOO_LARGE: string;
    DIRECTORY_NOT_FOUND: string;
    PYTHON_EXECUTION_ERROR: string;
    SYSTEM_ERROR: string;
    VALIDATION_ERROR: string;
};
export declare const REGEX_PATTERNS: {
    FILENAME: RegExp;
    PATH_TRAVERSAL: RegExp;
    PYTHON_SCRIPT: RegExp;
};
