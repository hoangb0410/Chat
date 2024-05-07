const redis = require('redis');

const client = redis.createClient({
    port: 6379,
    host: '127.0.0.1',
})

client.on("error", function(error){
    console.error(error);
});

client.on("connect", function(error){
    console.log('Connected to Redis');
});

module.exports = client;