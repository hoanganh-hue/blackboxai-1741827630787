import { Request } from 'express';
export interface IBaseManager {
    initialize(): Promise<void>;
    cleanup(): Promise<void>;
}
export interface IWebSocketManager extends IBaseManager {
    broadcast(message: any): void;
    send(clientId: string, message: any): void;
}
export interface IFileManager extends IBaseManager {
    readFile(path: string, options?: any): Promise<any>;
    writeFile(path: string, content: any, options?: any): Promise<boolean>;
    deleteFile(path: string): Promise<boolean>;
    listFiles(directory: string, options?: ListFilesOptions): Promise<FileInfo[]>;
    saveFile(file: Express.Multer.File): Promise<FileInfo>;
    getFileInfo(path: string): Promise<FileInfo>;
}
export interface ICommandManager extends IBaseManager {
    executeCommand(command: string, options?: CommandOptions): Promise<CommandResult>;
    stopCommand(id: string): boolean;
    getActiveCommands(): CommandInfo[];
}
export interface IPythonHandler extends IBaseManager {
    executeScript(scriptName: string, args?: string[]): Promise<any>;
    analyzeFile(filePath: string): Promise<any>;
    processData(data: any, options?: any): Promise<any>;
}
export interface IMonitoringManager extends IBaseManager {
    startMonitoring(interval?: number): void;
    stopMonitoring(): void;
    subscribe(clientId: string): void;
    unsubscribe(clientId: string): void;
}
export interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        username: string;
        roles: string[];
    };
}
export interface BaseResponse {
    success: boolean;
    data?: any;
    error?: {
        code: string;
        message: string;
        details?: any;
    };
}
export interface FileInfo {
    name: string;
    path: string;
    size: number;
    created: Date;
    modified: Date;
    isDirectory: boolean;
}
export interface FileUploadOptions {
    allowedTypes?: string[];
    maxSize?: number;
    destination?: string;
}
export interface FileListOptions {
    directory: string;
    recursive: boolean;
    filter?: string;
    sortBy?: 'name' | 'size' | 'date';
    order?: 'asc' | 'desc';
}
export interface ListFilesOptions {
    filter?: (file: FileInfo) => boolean;
    sort?: 'name' | 'size' | 'date';
}
export interface SystemInfo {
    os: {
        platform: string;
        release: string;
        arch: string;
    };
    memory: {
        total: number;
        free: number;
        used: number;
    };
    cpu: {
        model: string;
        cores: number;
        usage: number;
    };
    disk: {
        total: number;
        free: number;
        used: number;
    };
}
export interface SystemStatus {
    status: 'running' | 'stopped' | 'error';
    uptime: number;
    lastCheck: Date;
    services: {
        name: string;
        status: 'up' | 'down';
        lastCheck: Date;
    }[];
}
export interface PythonExecuteOptions {
    script: string;
    args?: string[];
    timeout?: number;
    env?: Record<string, string>;
}
export interface PythonAnalysisResult {
    output: any;
    error?: string;
    executionTime: number;
}
export interface BackupInfo {
    id: string;
    name: string;
    description?: string;
    createdAt: Date;
    size: number;
    files: string[];
    status: 'completed' | 'failed' | 'in_progress';
}
export interface BackupOptions {
    name?: string;
    description?: string;
    files?: string[];
    compress?: boolean;
}
export interface AppError extends Error {
    statusCode?: number;
    code?: string;
    details?: any;
}
export interface CacheOptions {
    ttl?: number;
    namespace?: string;
}
export * from './analysis';
export interface CommandOptions {
    workingDir?: string;
    timeout?: number;
    env?: Record<string, string>;
    shell?: boolean;
}
export interface CommandResult {
    id: string;
    command: string;
    code: number;
    output: string;
    error: string;
    duration: number;
    startTime: number;
    endTime: number;
}
export interface CommandInfo {
    id: string;
    command: string;
    startTime: number;
    duration: number;
    workingDir: string;
}
export interface WebSocketMessage {
    type: string;
    data: any;
    timestamp: number;
    source: string;
}
export interface SystemMetrics {
    cpu: {
        usage: number;
        count: number;
        model: string;
    };
    memory: {
        total: number;
        used: number;
        free: number;
        usage: number;
    };
    disk: {
        total: number;
        used: number;
        free: number;
        usage: number;
    };
    network: {
        bytesIn: number;
        bytesOut: number;
        packetsIn: number;
        packetsOut: number;
    };
    process: {
        pid: number;
        uptime: number;
        memory: number;
        cpu: number;
    };
}
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: {
        message: string;
        code?: string;
        details?: any;
    };
    meta?: {
        page?: number;
        limit?: number;
        total?: number;
        timestamp?: number;
    };
}
