"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFile = exports.downloadFile = exports.getFileInfo = exports.listFiles = exports.uploadFile = void 0;
const FileManager_1 = require("@/services/managers/FileManager");
const stream_1 = require("stream");
const fileManager = new FileManager_1.FileManager();
const uploadFile = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        // Create a Readable stream from the buffer
        const fileWithStream = {
            ...req.file,
            stream: stream_1.Readable.from(req.file.buffer)
        };
        const savedFile = await fileManager.saveFile(fileWithStream);
        res.json(savedFile);
    }
    catch (error) {
        next(error);
    }
};
exports.uploadFile = uploadFile;
const listFiles = async (req, res, next) => {
    try {
        const { directory = '', sort } = req.query;
        const files = await fileManager.listFiles(directory, {
            sort: sort
        });
        res.json(files);
    }
    catch (error) {
        next(error);
    }
};
exports.listFiles = listFiles;
const getFileInfo = async (req, res, next) => {
    try {
        const { filename } = req.params;
        const fileInfo = await fileManager.getFileInfo(filename);
        res.json(fileInfo);
    }
    catch (error) {
        next(error);
    }
};
exports.getFileInfo = getFileInfo;
const downloadFile = async (req, res, next) => {
    try {
        const { filename } = req.params;
        const filePath = await fileManager.getFilePath(filename);
        res.download(filePath, filename);
    }
    catch (error) {
        next(error);
    }
};
exports.downloadFile = downloadFile;
const deleteFile = async (req, res, next) => {
    try {
        const { filename } = req.params;
        await fileManager.deleteFile(filename);
        res.json({ message: 'File deleted successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteFile = deleteFile;
//# sourceMappingURL=fileController.js.map