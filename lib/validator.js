class ValidationError extends Error {
    constructor(field, message, value = null) {
        super(message);
        this.name = 'ValidationError';
        this.field = field;
        this.value = value;
    }
}

class Validator {
    static validateUrl(url) {
        if (!url || typeof url !== 'string') {
            throw new ValidationError('url', 'URL is required and must be a string', url);
        }

        try {
            const urlObj = new URL(url);
            if (!['http:', 'https:'].includes(urlObj.protocol)) {
                throw new ValidationError('url', 'URL must use http or https protocol', url);
            }
        } catch (error) {
            throw new ValidationError('url', 'Invalid URL format', url);
        }

        return url;
    }

    static validateUserCount(userCount) {
        if (userCount === undefined || userCount === null) {
            throw new ValidationError('userCount', 'User count is required', userCount);
        }

        const count = parseInt(userCount, 10);
        
        if (isNaN(count)) {
            throw new ValidationError('userCount', 'User count must be a number', userCount);
        }

        if (count < 1) {
            throw new ValidationError('userCount', 'User count must be at least 1', count);
        }

        if (count > 10) {
            throw new ValidationError('userCount', 'User count cannot exceed 10', count);
        }

        return count;
    }

    static validateActions(actions) {
        if (!actions) {
            return [];
        }

        if (!Array.isArray(actions)) {
            throw new ValidationError('actions', 'Actions must be an array', actions);
        }

        return actions.map((action, index) => {
            if (!action || typeof action !== 'object') {
                throw new ValidationError(
                    `actions[${index}]`,
                    'Action must be an object',
                    action
                );
            }

            if (!action.type) {
                throw new ValidationError(
                    `actions[${index}].type`,
                    'Action type is required',
                    action
                );
            }

            const validTypes = ['click', 'type', 'wait', 'scroll', 'navigate'];
            if (!validTypes.includes(action.type)) {
                throw new ValidationError(
                    `actions[${index}].type`,
                    `Invalid action type. Must be one of: ${validTypes.join(', ')}`,
                    action.type
                );
            }

            switch (action.type) {
                case 'click':
                case 'type':
                    if (!action.selector || typeof action.selector !== 'string') {
                        throw new ValidationError(
                            `actions[${index}].selector`,
                            'Selector is required for click/type actions',
                            action.selector
                        );
                    }
                    break;

                case 'wait':
                    if (!action.duration || typeof action.duration !== 'number') {
                        throw new ValidationError(
                            `actions[${index}].duration`,
                            'Duration is required for wait actions',
                            action.duration
                        );
                    }
                    if (action.duration < 0 || action.duration > 30000) {
                        throw new ValidationError(
                            `actions[${index}].duration`,
                            'Duration must be between 0 and 30000ms',
                            action.duration
                        );
                    }
                    break;
            }

            return action;
        });
    }

    static validateTestRequest(requestBody) {
        const errors = [];

        try {
            Validator.validateUrl(requestBody.url);
        } catch (error) {
            errors.push(error);
        }

        try {
            Validator.validateUserCount(requestBody.userCount);
        } catch (error) {
            errors.push(error);
        }

        try {
            Validator.validateActions(requestBody.actions);
        } catch (error) {
            errors.push(error);
        }

        if (errors.length > 0) {
            const errorMessages = errors.map(e => `${e.field}: ${e.message}`).join('; ');
            throw new ValidationError('request', errorMessages);
        }

        return {
            url: Validator.validateUrl(requestBody.url),
            userCount: Validator.validateUserCount(requestBody.userCount),
            actions: Validator.validateActions(requestBody.actions)
        };
    }

    static sanitizeString(str, maxLength = 1000) {
        if (!str || typeof str !== 'string') {
            return '';
        }

        return str
            .substring(0, maxLength)
            .replace(/[<>]/g, '')
            .trim();
    }

    static sanitizeErrorMessage(error) {
        if (!error) {
            return 'Unknown error occurred';
        }

        const message = error.message || String(error);
        return Validator.sanitizeString(message, 500);
    }
}

module.exports = { Validator, ValidationError };
