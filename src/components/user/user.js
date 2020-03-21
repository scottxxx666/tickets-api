const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: String,
  name: String,
  openIds: [{ platform: String, openId: String }],
}, { timestamps: true });

userSchema.index({ "openIds.platform": 1, "openIds.openId": 1 }, { unique: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
