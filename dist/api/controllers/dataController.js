"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scanDirectory = exports.analyzeFile = void 0;
const FileManager_1 = require("../../services/managers/FileManager");
const fileManager = new FileManager_1.FileManager();
const analyzeFile = async (req, res, next) => {
    try {
        const { path } = req.params;
        const fileInfo = await fileManager.getFileInfo(path);
        const analysis = await analyzeContent(fileInfo);
        res.json(analysis);
    }
    catch (error) {
        next(error);
    }
};
exports.analyzeFile = analyzeFile;
const scanDirectory = async (req, res, next) => {
    try {
        const { directory = '' } = req.body;
        const files = await fileManager.listFiles(directory, {
            filter: (file) => !file.isDirectory
        });
        const analyses = await Promise.all(files.map(async (file) => ({
            file: file.name,
            analysis: await analyzeContent(file)
        })));
        res.json(analyses);
    }
    catch (error) {
        next(error);
    }
};
exports.scanDirectory = scanDirectory;
async function analyzeContent(file) {
    // Implement file content analysis based on file type
    return {
        name: file.name,
        size: file.size,
        type: file.path.split('.').pop() || 'unknown',
        stats: {
            created: file.created,
            modified: file.modified
        }
    };
}
//# sourceMappingURL=dataController.js.map