"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSystemMetrics = exports.getSystemInfo = exports.getSystemStatus = void 0;
const os_1 = __importDefault(require("os"));
const getSystemStatus = async (req, res, next) => {
    try {
        const uptime = process.uptime();
        const status = {
            status: 'running',
            uptime: uptime,
            lastCheck: new Date(),
            services: [
                {
                    name: 'API Server',
                    status: 'up',
                    lastCheck: new Date()
                },
                {
                    name: 'File Service',
                    status: 'up',
                    lastCheck: new Date()
                }
            ]
        };
        res.json(status);
    }
    catch (error) {
        next(error);
    }
};
exports.getSystemStatus = getSystemStatus;
const getSystemInfo = async (req, res, next) => {
    try {
        const cpus = os_1.default.cpus();
        const networkInterfaces = os_1.default.networkInterfaces();
        const userInfo = os_1.default.userInfo();
        // Transform network interfaces to match the expected type
        const transformedInterfaces = {};
        Object.entries(networkInterfaces).forEach(([key, value]) => {
            if (value) {
                transformedInterfaces[key] = value.map(info => ({
                    address: info.address,
                    netmask: info.netmask || '',
                    family: info.family.toString(),
                    mac: info.mac,
                    internal: info.internal,
                    ...(info.cidr && { cidr: info.cidr }),
                    ...(info.scopeid !== undefined && { scopeid: info.scopeid })
                }));
            }
        });
        const systemInfo = {
            os: {
                platform: os_1.default.platform(),
                release: os_1.default.release(),
                arch: os_1.default.arch(),
                type: os_1.default.type(),
                version: os_1.default.version()
            },
            memory: {
                total: os_1.default.totalmem(),
                free: os_1.default.freemem(),
                used: os_1.default.totalmem() - os_1.default.freemem()
            },
            cpu: {
                model: cpus[0].model,
                cores: cpus.length,
                usage: process.cpuUsage().user / 1000000,
                loadAverage: os_1.default.loadavg()
            },
            disk: {
                total: 0,
                free: 0,
                used: 0
            },
            network: {
                interfaces: transformedInterfaces
            },
            system: {
                hostname: os_1.default.hostname(),
                uptime: os_1.default.uptime(),
                userInfo: {
                    uid: userInfo.uid,
                    gid: userInfo.gid,
                    username: userInfo.username,
                    homedir: userInfo.homedir,
                    shell: userInfo.shell || '/bin/bash' // Provide default if null
                }
            }
        };
        res.json(systemInfo);
    }
    catch (error) {
        next(error);
    }
};
exports.getSystemInfo = getSystemInfo;
const getSystemMetrics = async (req, res, next) => {
    try {
        const cpus = os_1.default.cpus();
        const metrics = {
            cpu: {
                usage: process.cpuUsage().user / 1000000,
                count: cpus.length,
                model: cpus[0].model,
                loadAverage: os_1.default.loadavg()
            },
            memory: {
                total: os_1.default.totalmem(),
                used: os_1.default.totalmem() - os_1.default.freemem(),
                free: os_1.default.freemem(),
                usage: (os_1.default.totalmem() - os_1.default.freemem()) / os_1.default.totalmem()
            },
            disk: {
                total: 0,
                used: 0,
                free: 0,
                usage: 0
            },
            network: {
                bytesIn: 0,
                bytesOut: 0,
                packetsIn: 0,
                packetsOut: 0,
                interfaces: {}
            },
            process: {
                pid: process.pid,
                uptime: process.uptime(),
                memory: process.memoryUsage().heapUsed,
                cpu: process.cpuUsage().user,
                threads: 1
            }
        };
        res.json(metrics);
    }
    catch (error) {
        next(error);
    }
};
exports.getSystemMetrics = getSystemMetrics;
//# sourceMappingURL=systemController.js.map