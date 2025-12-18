class AppError extends Error {
    constructor(message, statusCode = 500, isOperational = true) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.timestamp = new Date();
        Error.captureStackTrace(this, this.constructor);
    }
}

class ValidationError extends AppError {
    constructor(message, field = null) {
        super(message, 400, true);
        this.field = field;
    }
}

class NotFoundError extends AppError {
    constructor(resource) {
        super(`${resource} not found`, 404, true);
        this.resource = resource;
    }
}

class BrowserError extends AppError {
    constructor(message, originalError = null) {
        super(message, 500, true);
        this.originalError = originalError;
    }
}

class TimeoutError extends AppError {
    constructor(operation, timeout) {
        super(`Operation '${operation}' timed out after ${timeout}ms`, 504, true);
        this.operation = operation;
        this.timeout = timeout;
    }
}

class RateLimitError extends AppError {
    constructor(limit, window) {
        super(`Rate limit exceeded: ${limit} requests per ${window}`, 429, true);
        this.limit = limit;
        this.window = window;
    }
}

class ErrorHandler {
    static handleError(error, res = null) {
        if (error.isOperational) {
            this.logOperationalError(error);
        } else {
            this.logCriticalError(error);
        }

        if (res) {
            this.sendErrorResponse(error, res);
        }
    }

    static logOperationalError(error) {
        console.error('[OPERATIONAL ERROR]', {
            name: error.name,
            message: error.message,
            statusCode: error.statusCode,
            timestamp: error.timestamp,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }

    static logCriticalError(error) {
        console.error('[CRITICAL ERROR]', {
            name: error.name,
            message: error.message,
            stack: error.stack,
            timestamp: new Date()
        });
    }

    static sendErrorResponse(error, res) {
        const statusCode = error.statusCode || 500;
        const isProduction = process.env.NODE_ENV === 'production';

        const response = {
            success: false,
            error: {
                message: error.message,
                ...(error.field && { field: error.field }),
                ...(error.resource && { resource: error.resource }),
                ...(error.operation && { operation: error.operation })
            },
            timestamp: error.timestamp || new Date()
        };

        if (!isProduction && error.stack) {
            response.error.stack = error.stack;
        }

        res.status(statusCode).json(response);
    }

    static wrapAsync(fn) {
        return (req, res, next) => {
            Promise.resolve(fn(req, res, next)).catch(next);
        };
    }

    static createExpressErrorHandler() {
        return (error, req, res, next) => {
            ErrorHandler.handleError(error, res);
        };
    }
}

class RetryHandler {
    static async withRetry(operation, options = {}) {
        const {
            maxAttempts = 3,
            delay = 1000,
            backoff = 2,
            shouldRetry = () => true
        } = options;

        let lastError;
        
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                return await operation();
            } catch (error) {
                lastError = error;
                
                if (attempt === maxAttempts || !shouldRetry(error)) {
                    throw error;
                }

                const waitTime = delay * Math.pow(backoff, attempt - 1);
                console.log(`[RETRY] Attempt ${attempt} failed, retrying in ${waitTime}ms...`);
                await this.sleep(waitTime);
            }
        }

        throw lastError;
    }

    static sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

module.exports = {
    AppError,
    ValidationError,
    NotFoundError,
    BrowserError,
    TimeoutError,
    RateLimitError,
    ErrorHandler,
    RetryHandler
};
