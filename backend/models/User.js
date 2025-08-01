const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  photo: { type: String },
  status: { type: String, default: 'inactive' },
});

module.exports = mongoose.model('User', UserSchema);
