const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');
const typeDefs = require('./schema');
const { tickets, createTicket, updateTicket } = require('./components/tickets');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

require('dotenv').config();

let userSchema = new mongoose.Schema({
  email: String,
  name: String,
  openIds: [{ platform: String, openId: String }],
}, { timestamps: true });

userSchema.index({ "openIds.platform": 1, "openIds.openId": 1 }, { unique: true });

const User = mongoose.model('User', userSchema);

const clientId = process.env.GOOGLE_CLIENT_ID;

function generateToken(user) {
  return jwt.sign({
    user: { id: user.id },
  }, process.env.SECRET_KEY, { expiresIn: '3d' });

}

async function retrieveUserInfo(token) {
  const client = new OAuth2Client(clientId);
  const ticket = await client.verifyIdToken({ idToken: token });
  const openId = ticket.getUserId();
  const payload = ticket.getPayload();
  return { openId, payload };
}

const resolvers = {
  Query: {
    tickets,
  },
  Mutation: {
    signUp: async (_, args) => {
      const { openId, payload } = await retrieveUserInfo(args.token);
      if (payload.aud !== clientId) {
        throw new Error('Auth error!');
      }

      const userInput = {
        name: payload.name,
        openIds: [{ platform: 'GOOGLE', openId: openId }],
      };

      if (payload.email && payload.email_verified) {
        userInput.email = payload.email;
      }

      const user = await User.create(userInput);
      return {
        token: generateToken(user),
        user,
      };
    },
    login: async (_, args, context) => {
      const userInfo = await retrieveUserInfo(args.token);
      const user = await User.findOne({ 'openIds.platform': 'GOOGLE', 'openIds.openId': userInfo.openId });
      return {
        token: generateToken(user),
        user,
      };
    },
    createTicket,
    updateTicket,
  },
  Ticket: {
    event: (parent) => {
      return { id: parent.eventId };
    },
  },
};

mongoose.set('useFindAndModify', false);
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_URL}/${process.env.DB_NAME}`, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  autoIndex: true,
});

const server = new ApolloServer({
  typeDefs, resolvers, context: ({ req }) => {
    const auth = req.get('Authorization');
    if (auth) {
      const token = auth.replace('Bearer ', '');
      const { user } = jwt.verify(token, process.env.SECRET_KEY);
      return {
        user,
      };
    }
  },
});

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
