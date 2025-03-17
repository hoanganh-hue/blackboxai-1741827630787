const { redis } = require('./rateLimit');
const AdvancedLogger = require('../utils/advancedLogger');

const logger = new AdvancedLogger();

const cache = (duration) => {
    return async (req, res, next) => {
        const key = `cache:${req.originalUrl || req.url}`;
        
        try {
            const cachedResponse = await redis.get(key);
            
            if (cachedResponse) {
                const data = JSON.parse(cachedResponse);
                logger.debug('Cache hit:', key);
                return res.json(data);
            }

            // Override res.json to cache the response
            const originalJson = res.json;
            res.json = function(body) {
                redis.setex(key, duration, JSON.stringify(body))
                    .catch(err => logger.error('Cache error:', err));
                return originalJson.call(this, body);
            };

            next();
        } catch (error) {
            logger.error('Cache error:', error);
            next();
        }
    };
};

const clearCache = async (pattern) => {
    try {
        const keys = await redis.keys(`cache:${pattern}`);
        if (keys.length > 0) {
            await redis.del(keys);
            logger.info(`Cleared cache for pattern: ${pattern}`);
        }
    } catch (error) {
        logger.error('Clear cache error:', error);
    }
};

module.exports = {
    cache,
    clearCache
}; 