export interface SystemMetrics {
    cpu: {
        usage: number;
        count: number;
        model: string;
        loadAverage?: number[];
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
        interfaces?: {
            [key: string]: {
                bytesIn: number;
                bytesOut: number;
                packetsIn: number;
                packetsOut: number;
            };
        };
    };
    process: {
        pid: number;
        uptime: number;
        memory: number;
        cpu: number;
        threads?: number;
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
export interface SystemInfo {
    os: {
        platform: string;
        release: string;
        arch: string;
        type?: string;
        version?: string;
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
        loadAverage?: number[];
    };
    disk: {
        total: number;
        free: number;
        used: number;
    };
    network?: {
        interfaces: {
            [key: string]: {
                address: string;
                netmask: string;
                family: string;
                mac: string;
                internal: boolean;
                cidr?: string;
                scopeid?: number;
            }[];
        };
    };
    system?: {
        hostname: string;
        uptime: number;
        userInfo?: {
            uid: number;
            gid: number;
            username: string;
            homedir: string;
            shell: string;
        };
    };
}
