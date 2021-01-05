const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const cookieSession = require('cookie-session');
const helmet = require('helmet');
const cors = require('cors');
const keys = require('./config/keys');

// models
require('./models/User');
require('./models/Blog');

// services
require('./services/passport');
require('./services/redis-client');
require('./services/mongoose-redis-cache');

mongoose.connect(keys.mongoURI, { useNewUrlParser: true });
const app = express();

// middlewares
app.set('trust proxy', 1);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(helmet());
app.use(cookieSession({
  maxAge: 30 * 24 * 60 * 60000, // 60 seconds; summary 30 days
  keys: [keys.cookieKey],
}));
app.use(passport.initialize());
app.use(passport.session());

// const session = require('express-session');
// app.use(session({
//   secret: keys.cookieKey,
//   resave: false,
//   saveUninitialized: true,
//   cookie: {
//     secure: false,
//     maxAge: 30 * 24 * 60 * 60 * 1000,
//   },
// }));

// routes
require('./routes/authRoutes')(app);
require('./routes/blogRoutes')(app);

if (['production', 'ci'].includes(process.env.NODE_ENV)) {
  console.log('> STATIC')
  app.use(express.static('client/build'));

  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve('client', 'build', 'index.html'));
  });
}

// connection
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Listening on port`, PORT);
});
