import { Request, Response, NextFunction } from 'express';
export declare const executeCommand: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getCommandHistory: (req: Request, res: Response, next: NextFunction) => Promise<void>;
