import { Request, Response, NextFunction } from 'express';
export declare const analyzeFile: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const scanDirectory: (req: Request, res: Response, next: NextFunction) => Promise<void>;
