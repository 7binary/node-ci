const redis = require('redis');

const client = redis.createClient('redis://localhost:6379');

client.set('hi', 'there');
client.get('hi', (err, value) => console.log(value));
client.get('hi', console.log);

client.hset('german', 'red', 'rot');
client.hget('german', 'red', console.log);
