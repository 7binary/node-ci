const session = 'eyJwYXNzcG9ydCI6eyJ1c2VyIjoiNWZmMDI2MjA5YzZjMTI5ZjJmODY5ZWMxIn19';
const Buffer = require('safe-buffer').Buffer;

const value = Buffer.from(session, 'base64').toString('utf8');
console.log(value);

//-----------------------

const Keygrip = require('keygrip');
const keys = require('./config/keys');

const keygrip = new Keygrip([keys.cookieKey]);
sign = keygrip.sign(`express:sess=${session}`);

console.log(sign);

console.log(keygrip.verify(`express:sess=${session}`, sign));
