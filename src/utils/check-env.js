const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const advancedLogger = require('./advancedLogger');

dotenv.config();

const requiredEnvVars = [
    'NGROK_TOKEN',
    'PORT'
];

const logger = new advancedLogger(); // Initialize logger

let missingVars = [];

requiredEnvVars.forEach((envVar) => {
    if (!process.env[envVar]) {
        missingVars.push(envVar);
    }
});

if (missingVars.length > 0) {
    logger.error(`🚨 Missing environment variables: ${missingVars.join(', ')}`);
    console.error('Please set them in the .env file or export them in the shell.');
    process.exit(1);
} else {
    logger.info('✅ All required environment variables are set.');
}

// Check essential directories
const requiredDirs = ['logs', 'uploads'];
requiredDirs.forEach((dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        logger.info(`📁 Created missing directory: ${dir}`);
    }
});

logger.info('🚀 Environment check completed successfully.');
