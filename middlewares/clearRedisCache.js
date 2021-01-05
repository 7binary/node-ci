const redisClient = require('../services/redis-client');

module.exports = async (req, res, next) => {
  await next();

  redisClient.clearHash(req.user.id);
};
