const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');
const typeDefs = require('./schema');
const { getTickets, createTicket, updateTicket } = require('./components/tickets');

require('dotenv').config();

let userSchema = new mongoose.Schema({
  email: String,
  openIds: [{ platform: String, openId: String }],
}, { timestamps: true });

userSchema.index({ "openIds.openId": 1, "openIds.platform": 1 }, { unique: true });

const User = mongoose.model('User', userSchema);

const resolvers = {
  Query: {
    getTickets,
  },
  Mutation: {
    signUp: async (_, args) => {
      const user = await User.create({ email: '@@', openIds: [{ openId: args.openId, platform: args.platform }] });
      return { token: 'www', user };
    },
    login: async (_, args) => {
      const user = User.findOne({ 'openIds.platform': args.platform, 'openIds.openId': args.openId });
      return { token: 'login', user };
    },
    createTicket,
    updateTicket,
  },
};

mongoose.set('useFindAndModify', false);
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_URL}/${process.env.DB_NAME}`, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  autoIndex: true,
});

const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
