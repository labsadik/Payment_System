require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

const connectDB = require('./db');

const app = express();
connectDB();

// ================= MIDDLEWARE =================
app.use(express.json());
app.use(cors());
app.use(helmet());

// ================= RATE LIMIT =================
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
}));

// ================= STATIC =================

// ✅ FIX avatar access
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ serve frontend
app.use(express.static(path.join(__dirname, '../client')));

// ================= ROUTES =================
app.use('/api/auth', require('./routes/auth'));
app.use('/api/payment', require('./routes/payment'));

// ================= FIX CRASH (IMPORTANT) =================
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

// ================= START =================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('Server running on ' + PORT));