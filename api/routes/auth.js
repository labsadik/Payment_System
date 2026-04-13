const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const User = require('../models/User');
const auth = require('../middleware/authMiddleware');
require('dotenv').config();

// MULTER
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// REGISTER
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  const exist = await User.findOne({ email });
  if (exist) return res.json({ message: 'User exists' });

  const hash = await bcrypt.hash(password, 10);

  await User.create({ email, password: hash });

  res.json({ message: 'Registered' });
});

// LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.json({ message: 'User not found' });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.json({ message: 'Wrong password' });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  res.json({ token });
});

// ✅ FIXED /me
router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user.id).lean();

  res.json({
    name: user.name,
    email: user.email,
    payId: user.payId,
    balance: user.balance,
    profileImage: user.profileImage,
    pin: user.pin
  });
});

// SETUP PROFILE
router.post('/setup-profile', auth, upload.single('image'), async (req, res) => {

  // 🔢 10 digit pay id
  const num = Math.floor(1000000000 + Math.random() * 9000000000);
  const payId = num + '@pay';

  await User.findByIdAndUpdate(req.user.id, {
    name: req.body.name,
    age: req.body.age,
    profileImage: req.file?.path,
    payId
  });

  res.json({ payId });
});

module.exports = router;