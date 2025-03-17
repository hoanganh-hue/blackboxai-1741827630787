import { Request, Response, NextFunction } from 'express';
export declare const getSystemStatus: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getSystemInfo: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getSystemMetrics: (req: Request, res: Response, next: NextFunction) => Promise<void>;
