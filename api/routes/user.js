const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const auth = require('../middleware/authMiddleware');

// ================= GET USER BY PAY ID =================
// ✅ Public endpoint - no auth required (for sending money lookup)
router.get('/user/:payId', async (req, res) => {
  try {
    const user = await User.findOne({ payId: req.params.payId }).lean();

    if (!user) {
      return res.status(404).json({ message: 'User not found with this Pay ID' });
    }

    // Return only public info (no password, pin, or sensitive data)
    res.json({
      success: true,
      data: {
        name: user.name,
        payId: user.payId,
        profileImage: user.profileImage ? '/' + user.profileImage : null
      }
    });

  } catch (err) {
    console.error('❌ Error fetching user:', err);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching user details',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// ================= GET CURRENT USER PROFILE =================
// ✅ Protected endpoint - requires JWT token
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password -pin') // Exclude sensitive fields
      .lean();

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    // Get transaction counts for dashboard stats
    const sentCount = await Transaction.countDocuments({ 
      from: user.payId, 
      type: 'sent' 
    });
    
    const receivedCount = await Transaction.countDocuments({ 
      to: user.payId, 
      type: 'received' 
    });

    res.json({
      success: true,
      data: {
        ...user,
        profileImage: user.profileImage ? '/' + user.profileImage : null,
        stats: {
          totalTransactions: sentCount + receivedCount,
          totalSent: sentCount,
          totalReceived: receivedCount
        }
      }
    });

  } catch (err) {
    console.error('❌ Error loading profile:', err);
    res.status(500).json({ 
      success: false,
      message: 'Error loading profile'
    });
  }
});

// ================= UPDATE PROFILE =================
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, age } = req.body;
    
    const updateData = {};
    if (name) updateData.name = name;
    if (age) updateData.age = Number(age);

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password -pin').lean();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        name: updatedUser.name,
        age: updatedUser.age,
        email: updatedUser.email,
        payId: updatedUser.payId,
        balance: updatedUser.balance
      }
    });

  } catch (err) {
    console.error('❌ Error updating profile:', err);
    res.status(500).json({ 
      success: false,
      message: 'Error updating profile'
    });
  }
});

// ================= UPDATE PROFILE IMAGE =================
const multer = require('multer');
const path = require('path');

// Configure multer for avatar uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Accept images only
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter
});

router.post('/avatar', auth, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        message: 'No image file provided' 
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { profileImage: req.file.path },
      { new: true }
    ).select('-password -pin').lean();

    res.json({
      success: true,
      message: 'Avatar uploaded successfully',
      data: {
        profileImage: '/' + updatedUser.profileImage
      }
    });

  } catch (err) {
    console.error('❌ Error uploading avatar:', err);
    res.status(500).json({ 
      success: false,
      message: 'Error uploading avatar'
    });
  }
});

// ================= GET USER BALANCE =================
router.get('/balance', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('balance payId')
      .lean();

    res.json({
      success: true,
      data: {
        balance: user.balance,
        payId: user.payId,
        formattedBalance: '$' + user.balance.toFixed(2)
      }
    });

  } catch (err) {
    console.error('❌ Error fetching balance:', err);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching balance'
    });
  }
});

// ================= SEARCH USERS =================
router.get('/search/:query', auth, async (req, res) => {
  try {
    const query = req.params.query.trim();
    
    if (!query || query.length < 2) {
      return res.status(400).json({ 
        success: false,
        message: 'Search query must be at least 2 characters' 
      });
    }

    // Search by name, email, or payId (exclude current user)
    const users = await User.find({
      $and: [
        { _id: { $ne: req.user.id } }, // Exclude current user
        {
          $or: [
            { name: { $regex: query, $options: 'i' } },
            { payId: { $regex: query, $options: 'i' } },
            { email: { $regex: query, $options: 'i' } }
          ]
        }
      ]
    })
    .select('name payId profileImage')
    .limit(10)
    .lean();

    // Format results
    const results = users.map(u => ({
      _id: u._id,
      name: u.name || 'Unnamed User',
      payId: u.payId,
      profileImage: u.profileImage ? '/' + u.profileImage : null
    }));

    res.json({
      success: true,
      data: results,
      count: results.length
    });

  } catch (err) {
    console.error('❌ Error searching users:', err);
    res.status(500).json({ 
      success: false,
      message: 'Error searching users'
    });
  }
});

// ================= CHANGE PASSWORD =================
router.put('/password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        success: false,
        message: 'Current password and new password are required' 
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ 
        success: false,
        message: 'New password must be at least 6 characters' 
      });
    }

    const user = await User.findById(req.user.id);

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false,
        message: 'Current password is incorrect' 
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    user.password = hashedPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (err) {
    console.error('❌ Error changing password:', err);
    res.status(500).json({ 
      success: false,
      message: 'Error changing password'
    });
  }
});

// ================= DELETE ACCOUNT (Soft Delete) =================
router.delete('/account', auth, async (req, res) => {
  try {
    // In production, you might want to soft delete or anonymize instead
    await User.findByIdAndDelete(req.user.id);
    
    // Also delete all transactions (or keep for audit)
    // await Transaction.deleteMany({ $or: [{ from: user.payId }, { to: user.payId }] });

    res.json({
      success: true,
      message: 'Account deleted successfully'
    });

  } catch (err) {
    console.error('❌ Error deleting account:', err);
    res.status(500).json({ 
      success: false,
      message: 'Error deleting account'
    });
  }
});

// ================= GET ALL USERS (Admin Only - Optional) =================
router.get('/all', auth, async (req, res) => {
  try {
    // Optional: Add admin check here
    // if (req.user.role !== 'admin') return res.status(403).json(...)

    const users = await User.find({})
      .select('name email payId balance createdAt')
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    res.json({
      success: true,
      data: users,
      count: users.length
    });

  } catch (err) {
    console.error('❌ Error fetching users:', err);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching users list'
    });
  }
});

module.exports = router;