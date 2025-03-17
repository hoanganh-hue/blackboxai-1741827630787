const { execFile } = require('child_process');
const path = require('path');

process.on('message', (data) => {
    const scriptPath = path.resolve(__dirname, 'headless_gui.py');
    const command = JSON.stringify(data);
    
    execFile('/usr/local/bin/python3', [scriptPath, command], {
        cwd: __dirname
    }, (error, stdout, stderr) => {
        if (error) {
            process.send({ error: error.message, stderr });
            return;
        }
        try {
            const result = JSON.parse(stdout);
            process.send(result);
        } catch (e) {
            process.send({ 
                error: 'Invalid JSON output from Python script',
                stdout,
                stderr
            });
        }
    });
}); 