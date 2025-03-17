import { Request, Response, NextFunction } from 'express';
export declare const listProcesses: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const killProcess: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getProcessInfo: (req: Request, res: Response, next: NextFunction) => Promise<void>;
