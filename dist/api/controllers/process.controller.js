"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProcessInfo = exports.killProcess = exports.listProcesses = void 0;
const pidusage_1 = __importDefault(require("pidusage"));
const child_process_1 = require("child_process");
const util_1 = require("util");
const ps_node_1 = __importDefault(require("ps-node"));
const execAsync = (0, util_1.promisify)(child_process_1.exec);
const psLookup = (0, util_1.promisify)(ps_node_1.default.lookup);
const listProcesses = async (req, res, next) => {
    try {
        const processes = await psLookup({});
        const detailedProcesses = await Promise.all(processes.map(async (proc) => {
            try {
                const stats = await (0, pidusage_1.default)(proc.pid);
                return {
                    ...proc,
                    stats: {
                        cpu: stats.cpu.toFixed(2),
                        memory: (stats.memory / 1024 / 1024).toFixed(2) + ' MB',
                        elapsed: Math.floor(stats.elapsed / 1000) + ' seconds'
                    }
                };
            }
            catch (error) {
                return proc;
            }
        }));
        res.json(detailedProcesses);
    }
    catch (error) {
        next(error);
    }
};
exports.listProcesses = listProcesses;
const killProcess = async (req, res, next) => {
    try {
        const { pid } = req.params;
        if (!pid) {
            throw new Error('Process ID is required');
        }
        await new Promise((resolve, reject) => {
            ps_node_1.default.kill(pid, (err) => {
                if (err)
                    reject(err);
                resolve();
            });
        });
        res.json({ message: `Process ${pid} killed successfully` });
    }
    catch (error) {
        next(error);
    }
};
exports.killProcess = killProcess;
const getProcessInfo = async (req, res, next) => {
    try {
        const { pid } = req.params;
        if (!pid) {
            throw new Error('Process ID is required');
        }
        const processes = await psLookup({ pid: parseInt(pid) });
        if (processes.length === 0) {
            throw new Error('Process not found');
        }
        const stats = await (0, pidusage_1.default)(parseInt(pid));
        res.json({
            ...processes[0],
            stats: {
                cpu: stats.cpu.toFixed(2),
                memory: (stats.memory / 1024 / 1024).toFixed(2) + ' MB',
                elapsed: Math.floor(stats.elapsed / 1000) + ' seconds'
            }
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getProcessInfo = getProcessInfo;
//# sourceMappingURL=process.controller.js.map