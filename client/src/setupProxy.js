const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  const PORT = process.env.PORT || 5000;
  console.log('> PORT middleware', PORT);

  app.use('/auth', createProxyMiddleware({ target: `http://localhost:${PORT}` }));
  app.use('/api', createProxyMiddleware({ target: `http://localhost:${PORT}` }));
};
