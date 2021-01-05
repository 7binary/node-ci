const redis = require('redis');
const { promisify } = require('util');

const keys = require('../config/keys');
const redisClient = redis.createClient(keys.redisUrl);

redisClient.get = promisify(redisClient.get);
redisClient.hget = promisify(redisClient.hget);

redisClient.clearHash = function(hashKey) {
  this.del(JSON.stringify(hashKey));
  return this;
};

module.exports = redisClient;
