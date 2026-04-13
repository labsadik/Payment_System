const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  age: Number,
  email: { type: String, unique: true },
  password: String,
  profileImage: String,
  uniqueId: String,
  payId: String,
  pin: String,
  balance: { type: Number, default: 1000 }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);