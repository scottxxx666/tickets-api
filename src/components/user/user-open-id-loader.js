const DataLoader = require('dataloader');
const userRepo = require('./user-repository');

module.exports = () => {
  return new DataLoader(async (openIds) => {
    return openIds.map(openId => userRepo.getUserByOpenId(openId));
  });
};
