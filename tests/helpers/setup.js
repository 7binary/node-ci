jest.setTimeout(20000);
const mongoose = require('mongoose');
const keys = require('../../config/keys');

let User;
let Blog;
let mongo;

beforeAll(async () => {
  // const MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer;
  // mongo = new MongoMemoryServer();
  // const mongoUri = await mongo.getUri();
  // await mongoose.connect(mongoUri, {
  //   useNewUrlParser: true,
  //   useUnifiedTopology: true,
  // });

  mongoose.connect(keys.mongoURI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });

  require('../../models/Blog');
  require('../../models/User');
  User = mongoose.model('User');
  Blog = mongoose.model('Blog');
});

// beforeEach(async () => {
//   const collections = await mongoose.connection.db.collections();
//
//   for (let collection of collections) {
//     await collection.deleteMany({});
//   }
// });

afterAll(async () => {
  mongo && await mongo.stop();
  mongoose && await mongoose.connection.close();
});

global.getUser = async () => {
  let user = await User.findOne();
  if (user) return user;

  user = new User({
    googleId: '112479156670865533798',
    displayName: 'David Nil',
  });
  await user.save();

  return user;
};

global.getSession = (user) => {
  const Buffer = require('safe-buffer').Buffer;
  const sessionObject = {
    passport: {
      user: user._id.toString(),
    },
  };
  const session = Buffer.from(
    JSON.stringify(sessionObject),
  ).toString('base64');

  const Keygrip = require('keygrip');
  const keygrip = new Keygrip([keys.cookieKey]);
  const sig = keygrip.sign(`express:sess=${session}`);

  return { session, sig: sig };
};
