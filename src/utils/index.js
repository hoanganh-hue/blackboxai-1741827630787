require('dotenv').config();
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const { spawn, exec, execFile } = require('child_process');
const fs = require('fs-extra');
const path = require('path');
const ngrok = require('ngrok');
const winston = require('winston');
const os = require('os');
const multer = require('multer');
const WebSocketManager = require('./webSocketManager');
const CommandManager = require('./commandManager');
const systemRoutes = require('./api/routes/systemRoutes');
const dataRoutes = require('./api/routes/dataRoutes');
const logger = require('./api/utils/logger');
const PythonHandler = require('./pythonHandler');
const AdvancedLogger = require('./advancedLogger');
const { Builder, By, Key, until } = require('selenium-webdriver');
const { fork } = require('child_process');
const FileManager = require('./fileManager');
const FileAnalyzer = require('./fileAnalyzer');

// Initialize Express and WebSocket
const app = express();
const server = http.createServer(app);

// Initialize WebSocket and Command Managers
const wsManager = new WebSocketManager(server);
const commandManager = new CommandManager(wsManager);

// Initialize Logger
const advancedLogger = new AdvancedLogger();
const fileManager = new FileManager(advancedLogger);

// Initialize PythonHandler
const pythonHandler = new PythonHandler();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware to grant all permissions
app.use((req, res, next) => {
    // Grant all permissions without checking
    next();
});

// Add routes
app.use('/api/system', systemRoutes(commandManager));
app.use('/api/data', dataRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    logger.error('Server error:', err);
    res.status(500).json({ error: err.message });
});

// Ensure directories exist
fs.ensureDirSync('logs');
fs.ensureDirSync('uploads');

// ✅ Add `/` route to avoid "Cannot GET /" error
app.get('/', (req, res) => {
    res.json({ message: 'Server is running', status: 'OK' });
});

// Configure Upload
const upload = multer({
    dest: 'uploads/',
    limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit
});

// File management & operations
app.post('/api/files/upload', upload.single('file'), async(req, res) => {
    try {
        const destination = req.body.destination || '/';

        // Kiểm tra quyền truy cập
        if (!await fileManager.checkAccess(destination)) {
            return res.status(403).json({
                error: 'Permission denied',
                message: `Cannot access directory: ${destination}`
            });
        }

        const destPath = path.join(destination, req.file.originalname);
        await fs.move(req.file.path, destPath, { overwrite: true });

        advancedLogger.info(`File uploaded: ${destPath}`);
        res.json({
            message: 'File uploaded successfully',
            file: destPath,
            permissions: {
                read: await fileManager.checkAccess(destPath),
                write: await fileManager.checkAccess(destPath)
            }
        });
    } catch (error) {
        advancedLogger.error('Upload error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/apk/upload', upload.single('apk'), (req, res) => {
    const destination = req.body.destination || 'uploads';
    const destPath = path.join(__dirname, destination, req.file.originalname);
    fs.move(req.file.path, destPath, { overwrite: true })
        .then(() => {
            advancedLogger.info(`APK uploaded: ${destPath}`);
            res.json({ message: 'APK uploaded successfully', file: destPath });
        })
        .catch(err => {
            advancedLogger.error(`Error moving uploaded APK:`, err);
            res.status(500).json({ error: err.message });
        });
});

app.get('/api/files/:filename', (req, res) => {
    const directory = req.query.directory || 'uploads';
    const filePath = path.join(__dirname, directory, req.params.filename);
    res.download(filePath, (err) => {
        if (err) {
            advancedLogger.error(`Error downloading file ${req.params.filename}:`, err);
            res.status(500).json({ error: 'File download failed' });
        } else {
            advancedLogger.info(`Downloaded file: ${req.params.filename}`);
        }
    });
});

app.delete('/api/files/:filename', (req, res) => {
    const directory = req.query.directory || 'uploads';
    const filePath = path.join(__dirname, directory, req.params.filename);
    fs.remove(filePath)
        .then(() => {
            advancedLogger.info(`Deleted file: ${req.params.filename}`);
            res.json({ message: 'File deleted successfully' });
        })
        .catch(err => {
            advancedLogger.error(`Error deleting file ${req.params.filename}:`, err);
            res.status(500).json({ error: err.message });
        });
});

app.delete('/api/files/delete/:filename', async(req, res) => {
    const directory = req.query.directory || 'uploads';
    const filePath = path.join(__dirname, directory, req.params.filename);
    try {
        await fileManager.deleteFile(filePath);
        res.json({ message: 'File deleted successfully' });
    } catch (error) {
        advancedLogger.error(`Error deleting file ${filePath}:`, error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/files', (req, res) => {
    const directory = req.query.directory || 'uploads';
    const dirPath = path.join(__dirname, directory);
    fs.readdir(dirPath, (err, files) => {
        if (err) {
            advancedLogger.error('Error listing files:', err);
            return res.status(500).json({ error: 'Failed to list files' });
        }
        res.json({ files });
    });
});

app.get('/api/files/exists/:filename', async(req, res) => {
    const directory = req.query.directory || 'uploads';
    const filePath = path.join(__dirname, directory, req.params.filename);
    const exists = await fileManager.exists(filePath);
    res.json({ exists });
});

const fileAnalyzer = new FileAnalyzer(logger);

app.post('/api/files/analyze', async(req, res) => {
    const { filePath } = req.body;
    const analyzer = new FileAnalyzer(advancedLogger);

    try {
        const analysis = await analyzer.analyzeFile(filePath);
        res.json(analysis);
    } catch (error) {
        advancedLogger.error(`Error analyzing file ${filePath}:`, error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/files/read/:filename', async(req, res) => {
    const directory = req.query.directory || 'uploads';
    const filePath = path.join(__dirname, directory, req.params.filename);
    try {
        const content = await fileManager.readFile(filePath);
        res.json(content);
    } catch (error) {
        advancedLogger.error(`Error reading file ${filePath}:`, error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/files/write', async(req, res) => {
    const { filePath, content } = req.body;
    try {
        await fileManager.writeFile(filePath, content);
        res.json({ message: 'File written successfully' });
    } catch (error) {
        advancedLogger.error(`Error writing file ${filePath}:`, error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/files/list', async(req, res) => {
    const directory = req.query.path || '/';
    try {
        const files = await fileManager.listFiles(directory, {
            recursive: req.query.recursive === 'true'
        });
        res.json(files);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// System management & monitoring
app.get('/api/system/monitor', (req, res) => {
    const memoryUsage = {
        total: os.totalmem(),
        free: os.freemem(),
        usage: ((1 - os.freemem() / os.totalmem()) * 100).toFixed(2)
    };
    res.json({
        cpu: os.cpus(),
        memory: memoryUsage,
        uptime: os.uptime(),
        platform: os.platform(),
        arch: os.arch()
    });
});

app.get('/api/system/performance', (req, res) => {
    const performance = {
        cpu: os.cpus(),
        memory: {
            total: os.totalmem(),
            free: os.freemem(),
            usage: ((1 - os.freemem() / os.totalmem()) * 100).toFixed(2)
        },
        disk: {
            // Add logic to get disk usage
        },
        network: {
            // Add logic to get network usage
        }
    };
    res.json(performance);
});

app.get('/api/system/check-access', async(req, res) => {
    const path = req.query.path;
    if (!path) {
        return res.status(400).json({ error: 'Path is required' });
    }

    try {
        const access = await fileManager.checkAccess(path);
        res.json({
            path,
            access,
            exists: await fs.pathExists(path),
            isDirectory: await fs.statSync(path).isDirectory(),
            permissions: fs.statSync(path).mode.toString(8)
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Terminal management & command execution
app.post('/api/terminal/execute', (req, res) => {
    const command = req.body.command;
    const child = spawn(command, [], { shell: true });

    let output = '';

    child.stdout.on('data', (data) => {
        output += data.toString();
        res.write(data.toString());
    });

    child.stderr.on('data', (data) => {
        output += data.toString();
        res.write(data.toString());
    });

    child.on('close', (code) => {
        res.end(`\nCommand completed with exit code ${code}`);
        advancedLogger.info(`Executed command: ${command}`);
    });

    child.on('error', (error) => {
        res.status(500).json({ error: error.message });
        logger.error(`Error executing command: ${command}`, error);
    });
});

// APK analysis & processing
app.post('/api/apk/analyze', async(req, res) => {
    const apkPath = req.body.apkPath;
    if (!fs.existsSync(apkPath)) {
        logger.warn(`APK file not found: ${apkPath}`);
        return res.status(404).json({ message: 'APK file not found' });
    }
    logger.info(`Starting APK analysis for: ${apkPath}`);
    // Logic to analyze APK
    res.json({ message: 'APK analysis started' });
});

app.get('/api/apk/analyze/:filename', async(req, res) => {
    const apkPath = path.join(__dirname, 'uploads', req.params.filename);
    if (!fs.existsSync(apkPath)) {
        logger.warn(`APK file not found: ${apkPath}`);
        return res.status(404).json({ message: 'APK file not found' });
    }
    logger.info(`Analyzing APK: ${apkPath}`);
    const analyzer = new FileAnalyzer();
    const result = await analyzer.analyzeAPK(apkPath);
    res.json(result);
});

// Development & coding support
const backupDir = path.join(__dirname, 'backups');
fs.ensureDirSync(backupDir);

app.post('/api/code/edit', (req, res) => {
    const { filePath, content } = req.body;
    const backupPath = path.join(backupDir, path.basename(filePath) + '.bak');

    // Backup the original file
    fs.copyFile(filePath, backupPath, (err) => {
        if (err) {
            logger.error(`Error backing up file ${filePath}:`, err);
            return res.status(500).json({ error: err.message });
        }

        // Write the new content to the file
        fs.writeFile(filePath, content, (err) => {
            if (err) {
                logger.error(`Error editing file ${filePath}:`, err);
                return res.status(500).json({ error: err.message });
            }
            logger.info(`Edited file: ${filePath}`);
            res.json({ message: 'File edited successfully', backup: backupPath });
        });
    });
});

// GUI control endpoints
app.post('/api/gui/open', async(req, res) => {
    const { url } = req.body;
    let driver = await new Builder().forBrowser('chrome').build();
    try {
        await driver.get(url);
        res.json({ message: 'Browser opened', url });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/gui/click', (req, res) => {
    const { x, y } = req.body;
    const command = { action: 'click', params: { x, y } };
    const pythonPath = '/usr/local/bin/python3';
    const scriptPath = path.resolve(__dirname, 'executors', 'gui_ops', 'headless_gui.py');
    
    if (!fs.existsSync(scriptPath)) {
        return res.status(500).json({
            error: 'Python script not found',
            path: scriptPath
        });
    }

    if (!fs.existsSync(pythonPath)) {
        return res.status(500).json({
            error: 'Python interpreter not found',
            path: pythonPath
        });
    }

    console.log('Python path:', pythonPath);
    console.log('Script path:', scriptPath);
    console.log('Command:', command);
    
    const child = spawn(pythonPath, [scriptPath, JSON.stringify(command)], {
        shell: false,
        cwd: path.dirname(scriptPath)
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (data) => {
        stdout += data.toString();
        console.log('stdout:', data.toString());
    });

    child.stderr.on('data', (data) => {
        stderr += data.toString();
        console.error('stderr:', data.toString());
    });

    child.on('close', (code) => {
        console.log('Exit code:', code);
        if (code !== 0) {
            console.error('Python script error:', stderr);
            return res.status(500).json({ 
                error: 'Python script failed',
                code,
                stderr
            });
        }
        try {
            const result = JSON.parse(stdout);
            res.json(result);
        } catch (e) {
            console.error('JSON parse error:', e);
            console.error('stdout:', stdout);
            console.error('stderr:', stderr);
            res.status(500).json({ 
                error: 'Invalid JSON output from Python script',
                stdout,
                stderr
            });
        }
    });

    child.on('error', (error) => {
        console.error('Spawn error:', error);
        res.status(500).json({ 
            error: 'Failed to start Python script',
            message: error.message
        });
    });
});

app.post('/api/gui/type', (req, res) => {
    const { text, selector } = req.body;
    const command = JSON.stringify({ action: 'type', params: { text, selector } });
    exec(`python3 executors/gui_ops/headless_gui.py '${command}'`, (error, stdout, stderr) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.json(JSON.parse(stdout));
    });
});

app.post('/api/gui/screenshot', (req, res) => {
    const command = JSON.stringify({ action: 'screenshot' });
    exec(`python3 executors/gui_ops/headless_gui.py '${command}'`, (error, stdout, stderr) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        const result = JSON.parse(stdout);
        if (result.status === 'success') {
            res.sendFile(result.path, { root: __dirname });
        } else {
            res.status(500).json(result);
        }
    });
});

app.post('/api/gui/navigate', (req, res) => {
    const { url } = req.body;
    const command = JSON.stringify({ action: 'navigate', params: { url } });
    exec(`python3 executors/gui_ops/headless_gui.py '${command}'`, (error, stdout, stderr) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.json(JSON.parse(stdout));
    });
});

app.post('/api/gui/scroll', (req, res) => {
    const { amount } = req.body;
    exec(`python gui_control.py scroll ${amount}`, (error, stdout, stderr) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.json(JSON.parse(stdout));
    });
});

app.post('/api/gui/move', (req, res) => {
    const { x, y } = req.body;
    exec(`python gui_control.py move ${x} ${y}`, (error, stdout, stderr) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.json(JSON.parse(stdout));
    });
});

app.post('/api/gui/appium_click', (req, res) => {
    const { element_id } = req.body;
    exec(`python gui_control.py appium_click ${element_id}`, (error, stdout, stderr) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.json(JSON.parse(stdout));
    });
});

app.post('/api/gui/appium_type', (req, res) => {
    const { element_id, text } = req.body;
    exec(`python gui_control.py appium_type ${element_id} "${text}"`, (error, stdout, stderr) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.json(JSON.parse(stdout));
    });
});

app.post('/api/gui/appium_screenshot', (req, res) => {
    exec('python gui_control.py appium_screenshot', (error, stdout, stderr) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.json(JSON.parse(stdout));
    });
});

// System info route
app.get('/api/system/info', (req, res) => {
    res.json({
        hostname: os.hostname(),
        platform: os.platform(),
        release: os.release(),
        arch: os.arch(),
        cpus: os.cpus(),
        memory: {
            total: os.totalmem(),
            free: os.freemem(),
            used: os.totalmem() - os.freemem()
        },
        network: os.networkInterfaces(),
        uptime: os.uptime(),
        loadavg: os.loadavg(),
        userInfo: os.userInfo(),
        currentDir: process.cwd()
    });
});

// File analysis route
app.post('/api/analyze/file', async (req, res) => {
    try {
        const { filePath } = req.body;
        if (!filePath) {
            return res.status(400).json({ error: 'File path is required' });
        }
        const analysis = await fileAnalyzer.analyzeFile(filePath);
        res.json(analysis);
    } catch (error) {
        logger.error('Error analyzing file:', error);
        res.status(500).json({ error: error.message });
    }
});

// Python analysis & processing
app.post('/api/python/analyze', async (req, res) => {
    try {
        const { filePath } = req.body;
        const result = await pythonHandler.analyzeFile(filePath);
        res.json(result);
    } catch (error) {
        logger.error('Error in Python analysis:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/python/process', async (req, res) => {
    try {
        const { data } = req.body;
        const result = await pythonHandler.processData(data);
        res.json(result);
    } catch (error) {
        logger.error('Error in Python processing:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/python/execute', async (req, res) => {
    try {
        const { command } = req.body;
        const result = await pythonHandler.executeCommand(command);
        res.json(result);
    } catch (error) {
        logger.error('Error in Python command execution:', error);
        res.status(500).json({ error: error.message });
    }
});

// Handle process termination
process.on('SIGTERM', () => {
    logger.info('SIGTERM received. Shutting down gracefully...');
    commandManager.stopAllCommands();
    server.close(() => {
        logger.info('Server closed');
        process.exit(0);
    });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
});