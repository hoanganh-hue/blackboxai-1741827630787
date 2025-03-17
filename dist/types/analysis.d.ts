import { FileInfo } from '@/types';
export interface AnalysisOptions {
    detailed?: boolean;
    preview?: boolean;
    maxDepth?: number;
}
export interface BaseAnalysis {
    type: string;
    size: number;
    preview?: string;
}
export interface JsonAnalysis extends BaseAnalysis {
    type: 'json';
    structure: string;
    details?: {
        keys: string[];
        depth: number;
        nodeCount: number;
    };
}
export interface CsvAnalysis extends BaseAnalysis {
    type: 'csv';
    rowCount: number;
    headers: string[];
    details?: {
        columnCount: number;
        sampleRows: string[][];
    };
}
export interface TextAnalysis extends BaseAnalysis {
    type: 'text';
    lineCount: number;
    details?: {
        wordCount: number;
        charCount: number;
        emptyLines: number;
    };
}
export interface FileAnalysis {
    type: string;
    size: number;
    structure?: string;
    preview?: string;
    rowCount?: number;
    headers?: string[];
    lineCount?: number;
    details?: {
        nodeCount?: number;
        depth?: number;
        keys?: string[];
        rowCount?: number;
        columnCount?: number;
        headers?: string[];
        lineCount?: number;
        wordCount?: number;
        charCount?: number;
        preview?: string;
    };
}
export interface AnalysisResult {
    files: FileInfo[];
    results?: Array<FileInfo & {
        analysis?: FileAnalysis;
        error?: string;
    }>;
}
export interface DirectoryScanResult {
    directory: string;
    fileCount: number;
    files: FileInfo[];
    results?: Array<FileInfo & {
        analysis?: FileAnalysis;
        error?: string;
    }>;
}
