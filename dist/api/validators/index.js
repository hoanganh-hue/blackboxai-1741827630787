"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePythonScript = exports.validateFileSize = exports.validateFileType = exports.validateFilePath = exports.validate = exports.schemas = void 0;
const joi_1 = __importDefault(require("joi"));
// Validation schemas
exports.schemas = {
    // File API schemas
    file: {
        upload: joi_1.default.object({
            file: joi_1.default.any().required()
        }),
        info: joi_1.default.object({
            filename: joi_1.default.string().required()
        }),
        list: joi_1.default.object({
            directory: joi_1.default.string(),
            recursive: joi_1.default.boolean(),
            filter: joi_1.default.string()
        })
    },
    // Python API schemas
    python: {
        analyze: joi_1.default.object({
            filePath: joi_1.default.string().required()
        }),
        process: joi_1.default.object({
            data: joi_1.default.any().required(),
            options: joi_1.default.object()
        }),
        execute: joi_1.default.object({
            script: joi_1.default.string().required(),
            args: joi_1.default.array().items(joi_1.default.string())
        })
    },
    // Data API schemas
    data: {
        analyze: joi_1.default.object({
            filePath: joi_1.default.string().required(),
            options: joi_1.default.object({
                detailed: joi_1.default.boolean(),
                preview: joi_1.default.boolean(),
                maxDepth: joi_1.default.number().min(1)
            })
        }),
        scan: joi_1.default.object({
            directory: joi_1.default.string().required(),
            patterns: joi_1.default.array().items(joi_1.default.string()),
            recursive: joi_1.default.boolean(),
            options: joi_1.default.object({
                analyze: joi_1.default.boolean(),
                maxDepth: joi_1.default.number().min(1)
            })
        })
    },
    // Backup API schemas
    backup: {
        create: joi_1.default.object({
            name: joi_1.default.string(),
            description: joi_1.default.string(),
            files: joi_1.default.array().items(joi_1.default.string())
        }),
        restore: joi_1.default.object({
            id: joi_1.default.string().required()
        })
    }
};
// Validation middleware factory
const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true
        });
        if (error) {
            const validationError = new Error('Validation failed');
            validationError.statusCode = 400;
            validationError.code = 'VALIDATION_ERROR';
            validationError.details = error.details.map(detail => ({
                message: detail.message,
                path: detail.path
            }));
            return next(validationError);
        }
        next();
    };
};
exports.validate = validate;
// Custom validators
const validateFilePath = (filePath) => {
    // Prevent path traversal
    const normalizedPath = filePath.replace(/\\/g, '/');
    return !normalizedPath.includes('../') && !normalizedPath.includes('..\\');
};
exports.validateFilePath = validateFilePath;
const validateFileType = (filename, allowedTypes) => {
    const ext = filename.toLowerCase().split('.').pop();
    return ext ? allowedTypes.includes(`.${ext}`) : false;
};
exports.validateFileType = validateFileType;
const validateFileSize = (size, maxSize) => {
    return size <= maxSize;
};
exports.validateFileSize = validateFileSize;
const validatePythonScript = (script) => {
    // Basic Python script validation
    const dangerousPatterns = [
        'os.system',
        'subprocess',
        'eval(',
        'exec(',
        '__import__'
    ];
    return !dangerousPatterns.some(pattern => script.includes(pattern));
};
exports.validatePythonScript = validatePythonScript;
//# sourceMappingURL=index.js.map