const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const QRCode = require('qrcode');

const User = require('../models/User');
const Transaction = require('../models/Transaction');
const auth = require('../middleware/authMiddleware');

// ================= SET PIN =================
router.post('/set-pin', auth, async (req, res) => {
  const pin = req.body.pin;

  if (!pin || pin.length !== 4 || isNaN(pin))
    return res.json({ message: 'PIN must be 4 digits' });

  const hash = await bcrypt.hash(pin, 10);

  await User.findByIdAndUpdate(req.user.id, { pin: hash });

  res.json({ message: 'PIN set' });
});

// ================= SEND =================
router.post('/send', auth, async (req, res) => {
  try {
    const { toPayId, amount, pin } = req.body;

    const sender = await User.findById(req.user.id);
    const receiver = await User.findOne({ payId: toPayId });

    if (!receiver) return res.json({ message: 'User not found' });

    if (!sender.pin) return res.json({ message: 'Set PIN first' });

    const ok = await bcrypt.compare(pin, sender.pin);
    if (!ok) return res.json({ message: 'Wrong PIN' });

    const amt = Number(amount);

    if (!amt || amt <= 0)
      return res.json({ message: 'Invalid amount' });

    if (sender.balance < amt)
      return res.json({ message: 'No balance' });

    // 💰 TRANSFER
    sender.balance -= amt;
    receiver.balance += amt;

    await sender.save();
    await receiver.save();

    // 🔥 SAVE BOTH SIDES (IMPORTANT FIX)
    await Transaction.create([
      {
        from: sender.payId,
        to: receiver.payId,
        amount: amt,
        type: 'sent'
      },
      {
        from: sender.payId,
        to: receiver.payId,
        amount: amt,
        type: 'received'
      }
    ]);

    console.log("✅ Transaction saved");

    res.json({ message: 'Payment success' });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Payment failed' });
  }
});

// ================= HISTORY =================
router.get('/history', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    const data = await Transaction.find({
      $or: [
        { from: user.payId },
        { to: user.payId }
      ]
    }).sort({ date: -1 });

    console.log("📜 HISTORY:", data);

    res.json(data);

  } catch (err) {
    res.status(500).json({ message: 'Error loading history' });
  }
});

// ================= QR =================
router.get('/qr', auth, async (req, res) => {
  const user = await User.findById(req.user.id);
  const qr = await QRCode.toDataURL(user.payId);
  res.json({ qr });
});

// ================= GET USER =================
router.get('/user/:payId', async (req, res) => {
  const user = await User.findOne({ payId: req.params.payId });

  if (!user) return res.json({ message: 'User not found' });

  res.json({
    name: user.name,
    payId: user.payId
  });
});

module.exports = router;