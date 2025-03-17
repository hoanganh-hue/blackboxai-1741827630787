"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBackup = exports.downloadBackup = exports.listBackups = exports.createBackup = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const archiver_1 = __importDefault(require("archiver"));
const config_1 = __importDefault(require("../../config"));
const uuid_1 = require("uuid");
const createBackup = async (req, res, next) => {
    try {
        const { directories = [] } = req.body;
        const backupId = (0, uuid_1.v4)();
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupFileName = `backup-${timestamp}-${backupId}.zip`;
        const backupPath = path_1.default.join(config_1.default.storage.backupDir, backupFileName);
        const output = fs_extra_1.default.createWriteStream(backupPath);
        const archive = (0, archiver_1.default)('zip', {
            zlib: { level: 9 }
        });
        output.on('close', () => {
            res.json({
                message: 'Backup created successfully',
                backupId,
                fileName: backupFileName,
                size: archive.pointer()
            });
        });
        archive.on('error', (err) => {
            throw err;
        });
        archive.pipe(output);
        // Add specified directories or default to uploads directory
        const dirsToBackup = directories.length > 0
            ? directories
            : [config_1.default.storage.uploadDir];
        for (const dir of dirsToBackup) {
            const fullPath = path_1.default.resolve(dir);
            if (await fs_extra_1.default.pathExists(fullPath)) {
                archive.directory(fullPath, path_1.default.basename(fullPath));
            }
        }
        await archive.finalize();
    }
    catch (error) {
        next(error);
    }
};
exports.createBackup = createBackup;
const listBackups = async (req, res, next) => {
    try {
        const backups = await fs_extra_1.default.readdir(config_1.default.storage.backupDir);
        const backupDetails = await Promise.all(backups.map(async (backup) => {
            const backupPath = path_1.default.join(config_1.default.storage.backupDir, backup);
            const stats = await fs_extra_1.default.stat(backupPath);
            return {
                fileName: backup,
                size: stats.size,
                created: stats.birthtime
            };
        }));
        res.json(backupDetails);
    }
    catch (error) {
        next(error);
    }
};
exports.listBackups = listBackups;
const downloadBackup = async (req, res, next) => {
    try {
        const { fileName } = req.params;
        const backupPath = path_1.default.join(config_1.default.storage.backupDir, fileName);
        if (!await fs_extra_1.default.pathExists(backupPath)) {
            throw new Error('Backup file not found');
        }
        res.download(backupPath);
    }
    catch (error) {
        next(error);
    }
};
exports.downloadBackup = downloadBackup;
const deleteBackup = async (req, res, next) => {
    try {
        const { fileName } = req.params;
        const backupPath = path_1.default.join(config_1.default.storage.backupDir, fileName);
        if (!await fs_extra_1.default.pathExists(backupPath)) {
            throw new Error('Backup file not found');
        }
        await fs_extra_1.default.remove(backupPath);
        res.json({ message: 'Backup deleted successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteBackup = deleteBackup;
//# sourceMappingURL=backup.controller.js.map