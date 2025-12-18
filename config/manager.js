const fs = require('fs');
const path = require('path');

class ConfigManager {
    constructor() {
        this.config = null;
        this.configPath = path.join(__dirname, '..', 'config', 'default.json');
        this.loadConfig();
    }

    loadConfig() {
        try {
            const configData = fs.readFileSync(this.configPath, 'utf8');
            this.config = JSON.parse(configData);
            
            this.applyEnvironmentOverrides();
            this.validateConfig();
        } catch (error) {
            console.error('Failed to load configuration:', error.message);
            throw new Error('Configuration initialization failed');
        }
    }

    applyEnvironmentOverrides() {
        if (process.env.PORT) {
            this.config.server.port = parseInt(process.env.PORT, 10);
        }
        
        if (process.env.NODE_ENV === 'production') {
            this.config.bot.browser.headless = true;
            this.config.logging.level = 'warn';
        }
        
        if (process.env.LOG_LEVEL) {
            this.config.logging.level = process.env.LOG_LEVEL;
        }
    }

    validateConfig() {
        if (!this.config.server || !this.config.server.port) {
            throw new Error('Invalid configuration: server.port is required');
        }
        
        if (this.config.bot.concurrency.maxBots < this.config.bot.concurrency.minBots) {
            throw new Error('Invalid configuration: maxBots must be >= minBots');
        }
        
        if (this.config.testing.retryAttempts < 0) {
            throw new Error('Invalid configuration: retryAttempts must be >= 0');
        }
    }

    get(path) {
        const keys = path.split('.');
        let value = this.config;
        
        for (const key of keys) {
            if (value && typeof value === 'object' && key in value) {
                value = value[key];
            } else {
                return undefined;
            }
        }
        
        return value;
    }

    getServerConfig() {
        return this.config.server;
    }

    getBotConfig() {
        return this.config.bot;
    }

    getTestingConfig() {
        return this.config.testing;
    }

    getLoggingConfig() {
        return this.config.logging;
    }

    getReportsConfig() {
        return this.config.reports;
    }
}

module.exports = new ConfigManager();
