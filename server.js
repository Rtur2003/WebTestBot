const express = require('express');
const { Server } = require('socket.io');
const http = require('http');
const path = require('path');
const fs = require('fs');
const WebBot = require('./bot/web-bot');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));
app.use(express.json());

const bot = new WebBot();
const reports = [];

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/reports', (req, res) => {
    res.json(reports);
});

app.post('/api/start-test', async (req, res) => {
    const { url, actions, userCount } = req.body;

    try {
        const testId = Date.now().toString();
        res.json({ success: true, testId });

        // Start test in background
        startAutomationTest(testId, url, actions, userCount);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

async function startAutomationTest(testId, url, actions, userCount) {
    const report = {
        testId,
        url,
        startTime: new Date(),
        userCount,
        results: [],
        status: 'running'
    };

    reports.push(report);
    io.emit('test-started', { testId, url });

    try {
        const promises = [];
        for (let i = 0; i < userCount; i++) {
            promises.push(runSingleBot(testId, url, actions, i + 1));
        }

        const results = await Promise.all(promises);
        report.results = results;
        report.status = 'completed';
        report.endTime = new Date();

        io.emit('test-completed', report);
    } catch (error) {
        report.status = 'failed';
        report.error = error.message;
        report.endTime = new Date();

        io.emit('test-failed', report);
    }
}

async function runSingleBot(testId, url, actions, botId) {
    const botReport = {
        botId,
        startTime: new Date(),
        actions: [],
        errors: [],
        analysis: {},
        performance: {}
    };

    try {
        const result = await bot.runTest(url, actions, (update) => {
            io.emit('bot-update', { testId, botId, ...update });
        });

        botReport.actions = result.actions;
        botReport.errors = result.errors;
        botReport.analysis = result.analysis;
        botReport.performance = result.performance;
        botReport.success = result.success;

    } catch (error) {
        botReport.errors.push({
            type: 'CRITICAL_ERROR',
            message: error.message,
            timestamp: new Date()
        });
        botReport.success = false;
    }

    botReport.endTime = new Date();
    botReport.duration = botReport.endTime - botReport.startTime;

    return botReport;
}

io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`🤖 Web Test AI Server running on http://localhost:${PORT}`);
    console.log(`📊 Dashboard available at http://localhost:${PORT}`);
});