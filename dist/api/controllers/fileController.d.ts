import { Request, Response, NextFunction } from 'express';
import { Readable } from 'stream';
interface MulterFile {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    size: number;
    destination: string;
    filename: string;
    path: string;
    buffer: Buffer;
}
interface EnhancedMulterFile extends MulterFile {
    stream: Readable;
}
interface FileRequest extends Request {
    file?: EnhancedMulterFile;
}
export declare const uploadFile: (req: FileRequest, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const listFiles: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getFileInfo: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const downloadFile: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const deleteFile: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export {};
