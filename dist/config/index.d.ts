declare const config: {
    env: string;
    server: {
        port: string | number;
        host: string;
        cors: {
            origin: string;
            methods: string[];
        };
    };
    storage: {
        uploadDir: string;
        backupDir: string;
        logsDir: string;
        tempDir: string;
        maxFileSize: number;
        allowedTypes: string[];
    };
    python: {
        path: string;
        scriptsDir: string;
        virtualEnv: string | undefined;
        requirements: string[];
    };
    websocket: {
        path: string;
        pingInterval: number;
        pingTimeout: number;
    };
    monitoring: {
        interval: number;
        enabled: boolean;
    };
    cache: {
        enabled: boolean;
        ttl: number;
    };
    security: {
        rateLimiting: {
            windowMs: number;
            max: number;
        };
        helmet: {
            contentSecurityPolicy: {
                directives: {
                    defaultSrc: string[];
                    scriptSrc: string[];
                    styleSrc: string[];
                    imgSrc: string[];
                };
            };
        };
    };
    logger: {
        level: string;
        format: string;
    };
    openai: {
        apiKey: string | undefined;
    };
};
export default config;
