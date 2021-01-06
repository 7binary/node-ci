const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const requireLogin = require('../middlewares/requireLogin');
const keys = require('../config/keys');

const s3 = new AWS.S3({
  credentials: {
    accessKeyId: keys.accessKeyId,
    secretAccessKey: keys.secretAccessKey,
  },
  region: 'eu-central-1',
  accessKeyId: keys.accessKeyId,
  secretAccessKey: keys.secretAccessKey,
});

module.exports = app => {
  app.get('/api/upload', requireLogin, (req, res) => {
    const key = `${req.user.id}/${uuidv4()}.jpeg`;

    s3.getSignedUrl('putObject', {
      Bucket: 'zinart-blogster-images',
      ContentType: 'jpeg',
      Key: key,
    }, (err, url) => res.send({ key, url }));
  });
};
