import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
export declare const schemas: {
    file: {
        upload: Joi.ObjectSchema<any>;
        info: Joi.ObjectSchema<any>;
        list: Joi.ObjectSchema<any>;
    };
    python: {
        analyze: Joi.ObjectSchema<any>;
        process: Joi.ObjectSchema<any>;
        execute: Joi.ObjectSchema<any>;
    };
    data: {
        analyze: Joi.ObjectSchema<any>;
        scan: Joi.ObjectSchema<any>;
    };
    backup: {
        create: Joi.ObjectSchema<any>;
        restore: Joi.ObjectSchema<any>;
    };
};
export declare const validate: (schema: Joi.Schema) => (req: Request, res: Response, next: NextFunction) => void;
export declare const validateFilePath: (filePath: string) => boolean;
export declare const validateFileType: (filename: string, allowedTypes: string[]) => boolean;
export declare const validateFileSize: (size: number, maxSize: number) => boolean;
export declare const validatePythonScript: (script: string) => boolean;
