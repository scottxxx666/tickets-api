const mongoose = require('mongoose');

const initDB = () => {
  mongoose.set('useFindAndModify', false);
  mongoose.connect(`${process.env.DB_PROTOCOL}://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_URL}/${process.env.DB_NAME}`, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    autoIndex: true,
  });
};

module.exports = initDB;
