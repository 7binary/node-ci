const mongoose = require('mongoose');
const redisClient = require('./redis-client');

mongoose.Query.prototype.debugCache = function() {
  this._debugCache = true;
  return this;
};

mongoose.Query.prototype.cache = function(hashKey) {
  this._useCache = true;
  this._hashKey = JSON.stringify(hashKey || '');
  return this;
};

const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.exec = async function() {
  if (!this._useCache) {
    return exec.apply(this, arguments);
  }

  const key = JSON.stringify(Object.assign({}, this.getQuery(), {
    collection: this.mongooseCollection.name,
  }));
  const cachedValue = await redisClient.hget(this._hashKey, key);

  if (cachedValue) {
    this._debugCache && console.log('CACHED', cachedValue);
    const doc = JSON.parse(cachedValue);

    return Array.isArray(doc)
      ? doc.map(d => new this.model(d))
      : new this.model(doc);
  }

  const result = await exec.apply(this, arguments);

  redisClient.hset(this._hashKey, key, JSON.stringify(result));
  this._debugCache && console.log('RESULT', result);

  return result;
};
