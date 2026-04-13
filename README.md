# PaySystem - Complete Payment Application

A **full-stack digital wallet/payment system** built with Node.js, Express, MongoDB, and vanilla JavaScript frontend. Features user authentication, profile management, secure PIN-protected money transfers, QR code payments, and transaction history.


---

## ✨ **Features**

### 🔐 **Authentication & Security**
- ✅ User Registration & Login with JWT (JSON Web Tokens)
- ✅ Secure password hashing with bcryptjs
- ✅ Protected routes with middleware authentication
- ✅ 4-digit Security PIN for transactions
- ✅ Rate limiting & Helmet.js security headers

### 👤 **User Profile Management**
- ✅ Smart Profile Setup (First-time users see setup form)
- ✅ Profile Details View (Existing users see their info)
- ✅ Avatar/Profile picture upload (Multer)
- ✅ Auto-generated unique 10-digit Pay ID (`@pay`)
- ✅ Edit profile functionality

### 💰 **Payment System**
- ✅ Send money to other users via Pay ID
- ✅ PIN-protected transactions
- ✅ Real-time balance updates
- ✅ Recipient verification before sending
- ✅ Transaction confirmation dialogs

### 📱 **QR Code Payments**
- ✅ Generate personal payment QR code
- ✅ Scan-to-pay functionality
- ✅ Download QR code as image

### 📜 **Transaction History**
- ✅ **Three-tab view**: All / Sent / Received
- ✅ Color-coded transactions (Red=Sent, Green=Received)
- ✅ Transaction summary statistics (Total Sent/Received/Net Balance)
- ✅ Date/time formatting
- ✅ Searchable transaction list

### 🎨 **UI/UX Features**
- ✅ Modern, responsive design (Mobile-friendly)
- ✅ Smooth animations & transitions
- ✅ Toast notifications (Success/Error/Warning/Info)
- ✅ Loading states on buttons
- ✅ Modal-based forms
- ✅ Copy-to-clipboard for Pay IDs
- ✅ Dropdown user menu
- ✅ Form validation with error messages

---

## 🛠️ **Tech Stack**

### **Backend:**
| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 14+ | Runtime environment |
| **Express.js** | 4.x | Web framework |
| **MongoDB** | 4.x+ | Database |
| **Mongoose** | 6.x | ODM for MongoDB |
| **JWT** | jsonwebtoken | Authentication tokens |
| **bcryptjs** | 2.x | Password hashing |
| **Multer** | 1.x | File upload handling |
| **QRCode** | qrcode | QR code generation |
| **CORS** | cors | Cross-origin resource sharing |
| **Helmet** | helmet | Security headers |
| **dotenv** | 16.x | Environment variables |

### **Frontend:**
| Technology | Purpose |
|------------|---------|
| **HTML5** | Structure |
| **CSS3** | Styling (Custom, no frameworks) |
| **Vanilla JavaScript** | Logic & API integration |
| **Fetch API** | HTTP requests |
| **LocalStorage** | Token persistence |

### **Tools:**
- **VS Code** - Development environment
- **Postman/cURL** - API testing
- **Git** - Version control

---

## 📁 **Project Structure**

```
payment-system/
│
├── 📂 api/                          # Backend Source Code
│   ├── 📂 models/                   # MongoDB Models/Schemas
│   │   ├── User.js                  # User model (name, email, password, balance, pin, etc.)
│   │   └── Transaction.js           # Transaction model (from, to, amount, type, date)
│   │
│   ├── 📂 middleware/                # Express Middleware
│   │   └── authMiddleware.js        # JWT authentication verifier
│   │
│   ├── 📂 routes/                   # API Route Handlers
│   │   ├── auth.js                  # Auth routes (login, register, me, setup-profile)
│   │   ├── payment.js               # Payment routes (send, set-pin, history, qr, user lookup)
│   │   └── user.js                  # User routes (profile, avatar, search, etc.)
│   │
│   ├── db.js                        # MongoDB connection configuration
│   └── server.js                    # Main server entry point (Express app setup)
│
├── 📂 client/                       # Frontend Source Code
│   ├── index.html                   # Login/Register page
│   ├── dashboard.html               # Main dashboard (Profile, History, Actions)
│   ├── user.js                      # API client functions & utilities
│   └── style.css                    # Complete stylesheet (responsive design)
│
├── 📂 uploads/                      # Uploaded profile images (auto-created)
│
├── .env                             # Environment variables (NOT committed to Git)
├── package.json                     # NPM dependencies & scripts
├── .gitignore                       # Git ignore rules
└── README.md                        # This file! 📖
```

---

## 🚀 **Installation & Setup**

### **Prerequisites:**
- ✅ **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- ✅ **MongoDB** (Local installation or Atlas cloud) - [Get MongoDB](https://www.mongodb.com/)
- ✅ **Code Editor** (VS Code recommended) - [Download VS Code](https://code.visualstudio.com/)
- ✅ **Git** (Optional, for version control)

---

### **Step 1: Clone or Download Project**

```bash

# Or download ZIP and extract
cd payment-system
```

---

### **Step 2: Install Backend Dependencies**

```bash
# Navigate to project root
cd payment-system

# Install all npm packages
npm install

# This will install:
# express, mongoose, bcryptjs, jsonwebtoken, multer,
# qrcode, cors, helmet, dotenv, express-rate-limit
```

**Expected `package.json`:**
```json
{
  "name": "payment-system",
  "version": "1.0.0",
  "description": "Digital Wallet Payment System",
  "main": "api/server.js",
  "scripts": {
    "start": "node api/server.js",
    "dev": "nodemon api/server.js"
  },
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.0.3",
    "express": "^4.18.2",
    "express-rate-limit": "^6.7.0",
    "helmet": "^7.0.0",
    "jsonwebtoken": "^9.0.0",
    "mongoose": "^6.8.0",
    "multer": "^1.4.5-lts.1",
    "qrcode": "^1.5.1"
  }
}
```

---

### **Step 3: Configure Environment Variables**

Create a `.env` file in the **project root** (same level as `package.json`):

```bash
# Create .env file
touch .env   # (Linux/Mac)
# or create manually in Windows
```

**Add these contents to `.env`:**

```env
# ============================================
# PAYMENT SYSTEM - ENVIRONMENT CONFIGURATION
# ============================================

# Server Port (Default: 5000)
PORT=5000

# MongoDB Connection String
# Option A: Local MongoDB
MONGO_URI=mongodb://localhost:27017/paymentsystem

# Option B: MongoDB Atlas Cloud (Recommended for production)
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/paymentsystem?retryWrites=true&w=majority

# JWT Secret Key (Change this to a random string in production!)
JWT_SECRET=your_super_secret_jwt_key_here_change_this_12345!

# Environment Mode
NODE_ENV=development
# NODE_ENV=production  (Uncomment for production)
```

> ⚠️ **Security Note:** Never commit `.env` to GitHub! It's already in `.gitignore`.

---

### **Step 4: Start MongoDB**

#### **Option A: Local Installation**
```bash
# Start MongoDB service (if installed locally)
# Windows:
net start MongoDB

# Mac (with Homebrew):
brew services start mongodb-community

# Linux:
sudo systemctl start mongod

# Verify MongoDB is running:
mongosh --eval "db.runCommand({ ping: 1 })"
```

#### **Option B: MongoDB Atlas (Cloud - Easier)**
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create free account & cluster
3. Create database user & whitelist IP (0.0.0.0 for development)
4. Copy connection string → Paste in `.env` as `MONGO_URI`

---

### **Step 5: Start Backend Server**

```bash
# In project root directory:
npm start

# OR if you have nodemon installed (auto-restarts on changes):
npm run dev
```

**Successful Output:**
```
✅ Server running on 5000
✅ DB Connected
```

**Test Backend:**
```bash
# Open new terminal and test:
curl http://localhost:5000/
# Should return index.html or 404 (depending on your static serving config)
```

---

### **Step 6: Start Frontend**

#### **Option A: VS Code Live Server (Easiest)**
1. Open project in **VS Code**
2. Install extension: **"Live Server"** by Ritwick Dey
3. Right-click `client/index.html` → **"Open with Live Server"**
4. Opens at `http://localhost:5500` (or similar port)

#### **Option B: Python HTTP Server**
```bash
cd client
python -m http.server 3000
# Open http://localhost:3000
```

#### **Option C: Node Serve Package**
```bash
npx serve client -l 3000
# Open http://localhost:3000
```

#### **Option D: From Backend (If configured in server.js)**
```bash
# If your server.js serves static files from '../client':
# Just open http://localhost:5000 in browser
```

---

## 🌐 **Accessing the Application**

| Component | URL | Description |
|-----------|-----|-------------|
| **Frontend (Login)** | `http://localhost:5500` (or your Live Server port) | Login/Register page |
| **Backend API** | `http://localhost:5000/api/*` | REST API endpoints |
| **MongoDB** | `localhost:27017` | Database (local) |

---

## 📚 **API Documentation**

### **Base URL:** `http://localhost:5000/api`

---

### **🔐 Authentication Endpoints**

#### **1. Register New User**
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

✅ Response (201):
{
  "message": "Registered"
}

❌ Error (400):
{
  "message": "User exists"
}
```

---

#### **2. Login User**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

✅ Response (200):
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

❌ Error (401):
{
  "message": "User not found"  // or "Wrong password"
}
```

---

#### **3. Get Current User Profile**
```http
GET /api/auth/me
Authorization: Bearer <jwt_token>

✅ Response (200):
{
  "name": "John Doe",
  "email": "user@example.com",
  "payId": "9876543210@pay",
  "balance": 1500.00,
  "profileImage": "/uploads/avatar-1234567890.jpg",
  "pin": "$2a$10$hashed_pin..."
}

❌ Error (401):
{ "message": "Invalid token" }
```

---

#### **4. Setup/Update Profile**
```http
POST /api/auth/setup-profile
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data

Form Data:
- name: "John Doe"
- age: "25"
- image: (file, optional)

✅ Response (200):
{
  "payId": "9876543210@pay"
}
```

---

### **💰 Payment Endpoints**

#### **5. Set Security PIN**
```http
POST /api/payment/set-pin
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "pin": "1234"
}

✅ Response (200):
{ "message": "PIN set" }

❌ Error (400):
{ "message": "PIN must be 4 digits" }
```

---

#### **6. Send Money**
```http
POST /api/payment/send
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "toPayId": "1234567890@pay",
  "amount": "50.00",
  "pin": "1234"
}

✅ Response (200):
{ "message": "Payment success" }

❌ Errors:
{ "message": "User not found" }        // Recipient doesn't exist
{ "message": "Set PIN first" }         // Sender hasn't set PIN
{ "message": "Wrong PIN" }             // Incorrect PIN
{ "message": "Invalid amount" }        // Amount <= 0
{ "message": "No balance" }            // Insufficient funds
```

---

#### **7. Get Transaction History**
```http
GET /api/payment/history
Authorization: Bearer <jwt_token>

✅ Response (200): Array of Transactions
[
  {
    "_id": "64a1b2c3d4e5f6...",
    "from": "9876543210@pay",     // Sender's Pay ID
    "to": "1234567890@pay",       // Receiver's Pay ID
    "amount": 50,
    "type": "sent",              // "sent" or "received"
    "date": "2024-01-15T14:30:00.000Z"
  },
  {
    "from": "5555555555@pay",
    "to": "9876543210@pay",
    "amount": 100,
    "type": "received",
    "date": "2024-01-14T09:20:00.000Z"
  }
]
```

---

#### **8. Generate QR Code**
```http
GET /api/payment/qr
Authorization: Bearer <jwt_token>

✅ Response (200):
{
  "qr": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."  // Base64 encoded PNG
}
```

---

#### **9. Look Up User by Pay ID** (Public - No Auth Required)
```http
GET /api/payment/user/:payId

Example: GET /api/payment/user/1234567890@pay

✅ Response (200):
{
  "name": "Jane Smith",
  "payId": "1234567890@pay"
}

❌ Error (404):
{ "message": "User not found" }
```

---

### **👤 User Management Endpoints** (From `routes/user.js`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/user/:payId` | ❌ No | Find user by Pay ID |
| GET | `/api/profile` | ✅ Yes | Get full profile + stats |
| PUT | `/api/profile` | ✅ Yes | Update name/age |
| POST | `/api/avatar` | ✅ Yes | Upload profile image |
| GET | `/api/balance` | ✅ Yes | Get current balance |
| GET | `/api/search/:query` | ✅ Yes | Search users by name/email/PayID |
| PUT | `/api/password` | ✅ Yes | Change password |
| DELETE | `/api/account` | ✅ Yes | Delete account |
| GET | `/api/all` | ✅ Yes | List all users (admin) |

---

## 🎯 **User Guide: How to Use**

### **Step-by-Step Workflow:**

#### **1️⃣ Register Account**
1. Open `http://localhost:5500` (frontend)
2. Click **"Register Now"**
3. Enter email & password (min 6 chars)
4. Click **"Create Account"**
5. Success message appears → Auto-switches to login form

#### **2️⃣ Login**
1. Enter email & password
2. Click **"Login"**
3. Redirects to Dashboard automatically

#### **3️⃣ Setup Profile (First Time Only)**
After login, you'll see **⚠️ Setup Required** section:

1. Enter your **Full Name**
2. Enter your **Age**
3. Optionally upload a **Profile Photo**
4. Click **"✨ Create My Profile"**
5. System generates your unique **10-digit Pay ID** (e.g., `9876543210@pay`)
6. Profile view switches to **✅ My Profile** showing all details

#### **4️⃣ Set Security PIN**
1. Click **"🔐 Set PIN"** action button
2. Enter **4-digit PIN** (numbers only)
3. Click **"Set PIN"**
4. PIN status badge turns green: **✅ Active**
5. ⚠️ **Required before sending money!**

#### **5️⃣ Send Money**
1. Click **"💸 Send Money"** action button
2. Enter recipient's **Pay ID** (e.g., `1234567890@pay`)
3. Enter **Amount** (must be > $0)
4. Enter your **4-digit PIN**
5. Click **"Send Money"**
6. Confirmation dialog appears
7. Success notification shows
8. **Balance updates instantly**, transaction appears in history

#### **6️⃣ Receive Payments (Two Ways)**

**Method A: Share Pay ID**
- Your Pay ID is displayed in Profile section
- Click **📋** icon to copy
- Share with sender

**Method B: QR Code**
1. Click **"📱 My QR Code"** action button
2. QR code displays with your Pay ID
3. Recipient scans QR code
4. OR click **"⬇️ Download QR"** to save/share image

#### **7️⃣ View Transaction History**
Navigate to **📜 Transaction History** section:

- **📋 All Tab**: Shows every transaction (sent + received)
- **💸 Sent Tab**: Only payments you sent (red amounts)
- **📥 Received Tab**: Only payments you received (green amounts)

**Summary Stats at Bottom:**
- Total Sent: $XXX.XX
- Total Received: $XXX.XX  
- Net Balance: $XXX.XX (color-coded green/red)

#### **8️⃣ Edit Profile (Anytime)**
1. Scroll to **My Profile** section
2. Click **"✏️ Edit Profile"** button
3. Update name, age, or upload new photo
4. Click **"Save Changes"**
5. Updates immediately reflect

---

## 🧪 **Testing the Application**

### **Manual Testing Checklist:**

#### **Authentication Tests:**
- [ ] Register new user with valid email/password
- [ ] Try registering same email twice (should fail)
- [ ] Login with correct credentials (should get token)
- [ ] Login with wrong password (should fail)
- [ ] Access dashboard without token (should redirect to login)

#### **Profile Tests:**
- [ ] First-time user sees setup form
- [ ] After setup, sees profile details view
- [ ] Avatar upload works (image appears)
- [ ] Edit profile updates correctly
- [ ] Pay ID generated correctly (10 digits + @pay)

#### **Payment Tests:**
- [ ] Try sending without PIN (should show warning)
- [ ] Set 4-digit PIN successfully
- [ ] Send money to valid user (should succeed)
- [ ] Send money to invalid Pay ID (should fail)
- [ ] Send more than balance (should fail)
- [ ] Wrong PIN rejection works
- [ ] Balance updates after successful send

#### **Transaction History Tests:**
- [ ] All tab shows mixed transactions
- [ ] Sent tab filters correctly
- [ ] Received tab filters correctly
- [ ] Tab counts update accurately
- [ ] Summary stats calculate correctly
- [ ] Empty states show appropriate messages

#### **QR Code Tests:**
- [ ] Generate QR code without error
- [ ] QR code displays as image
- [ ] Download QR saves file
- [ ] QR contains correct Pay ID

---

### **API Testing with Postman/cURL:**

**Test Registration:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}'
```

**Test Login & Save Token:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}'
# Copy the token from response
```

**Test Get User (replace TOKEN):**
```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: YOUR_TOKEN_HERE"
```

**Test Send Money:**
```bash
curl -X POST http://localhost:5000/api/payment/send \
  -H "Authorization: YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"toPayId":"RECIPIENT_PAY_ID","amount":"10","pin":"1234"}'
```

---

## 🐛 **Troubleshooting Common Issues**

| Issue | Cause | Solution |
|-------|-------|----------|
| **`ECONNREFUSED` error** | Backend not running | Run `npm start` in project root |
| **`MongoNetworkError`** | MongoDB not started | Start MongoDB service locally or check Atlas connection string |
| **CORS errors in browser** | Frontend/backend different origins | Ensure `cors()` is configured in `server.js` |
| **`401 Unauthorized`** | Invalid/expired token | Clear localStorage: In browser console run `localStorage.clear()` then re-login |
| **Images not loading** | Missing `/uploads` folder | Create folder: `mkdir uploads` in project root |
| **`Cannot POST /api/auth/register`** | Routes not mounted | Check `app.use('/api/auth', require('./routes/auth'))` in server.js |
| **Blank page after login** | Token verification fails | Check browser console for errors, verify JWT_SECRET matches |
| **PIN always wrong** | PIN stored as hash | Use `bcrypt.compare()` to verify, don't compare plain text |
| **File upload too large** | Multer limits | Default limit is fine; adjust in storage config if needed |
| **Port already in use** | Another process using port 5000 | Kill process: `taskkill /F /PID <pid>` (Windows) or use different PORT in `.env` |

---

## 🔒 **Security Best Practices (Production)**

Before deploying to production:

- [x] ✅ Change `JWT_SECRET` to a strong random string (64+ characters)
- [x] ✅ Enable HTTPS (SSL/TLS certificate)
- [x] ✅ Use environment variables (never hardcode secrets)
- [x] ✅ Implement rate limiting (already included)
- [x] ✅ Add input validation & sanitization
- [x] ✅ UseHelmet.js for security headers (already included)
- [ ] ⚠️ Add email verification for registration
- [ ] ⚠️ Implement 2FA (Two-Factor Authentication)
- [ ] ⚠️ Add transaction limits per day/hour
- [ ] ⚠️ Audit logs for sensitive actions
- [ ] ⚠️ Regular dependency updates (`npm audit`)
- [ ] ⚠️ Set up MongoDB authentication (username/password)
- [ ] ⚠️ Use Redis for session management (optional)

---

## 📊 **Database Schema**

### **User Collection:**
```javascript
{
  _id: ObjectId,
  name: String,              // Display name
  age: Number,               // User age
  email: { 
    type: String, 
    unique: true             // Unique constraint
  },
  password: String,          // Hashed with bcrypt
  profileImage: String,      // Path to uploaded avatar
  uniqueId: String,          // Internal unique identifier
  payId: String,             // Public payment ID (e.g., "1234567890@pay")
  pin: String,               // Hashed 4-digit PIN
  balance: { 
    type: Number, 
    default: 1000            // Starting balance $1000
  },
  createdAt: Date,           // Auto-generated timestamp
  updatedAt: Date            // Auto-updated timestamp
}
```

### **Transaction Collection:**
```javascript
{
  _id: ObjectId,
  from: String,              // Sender's Pay ID
  to: String,                // Receiver's Pay ID
  amount: Number,            // Transfer amount
  type: String,              // "sent" or "received"
  date: { 
    type: Date, 
    default: Date.now        // Transaction timestamp
  }
}
```

---

## 🚢 **Deployment Options**

### **Option 1: Railway.sh (Easiest)**
1. Push code to GitHub
2. Connect repo to [Railway.app](https://railway.app)
3. Set environment variables in Railway dashboard
4. Deploy automatically on push

### **Option 2: Render.com**
1. Create account at [Render](https://render.com)
2. Connect GitHub repository
3. Select "Web Service"
4. Add environment variables
5. Deploy

### **Option 3: VPS (DigitalOcean/Linode/AWS)**
```bash
# Install PM2 process manager globally
npm install -g pm2

# Start application with PM2
pm2 start api/server.js --name "paymentsystem"

# Save PM2 configuration
pm2 save
pm2 startup

# Setup Nginx reverse proxy (recommended)
sudo apt install nginx
# Configure /etc/nginx/sites-available/default
```

### **Option 4: Heroku (Classic)**
```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create my-payment-system

# Set environment variables
heroku config:set JWT_SECRET=your_secret_here
heroku config:set MONGO_URI=mongodb+srv://...

# Deploy
git push heroku main
```

---

## 🤝 **Contributing**

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to branch: `git push origin feature/amazing-feature`
5. **Submit** a Pull Request

### **Development Guidelines:**
- Write clean, commented code
- Follow existing code style
- Test thoroughly before submitting
- Update README if needed
- Use descriptive commit messages

---

## 📝 **Future Enhancements (Roadmap)**

### **Phase 2 Features:**
- [ ] Email verification on registration
- [ ] Password reset via email
- [ ] Transaction notifications (email/SMS)
- [ ] Recurring payments/subscriptions
- [ ] Payment request feature ("Request Money")

### **Phase 3 Features:**
- [ ] Admin dashboard with analytics
- [ ] Multi-currency support
- [ ] Payment splitting (bill split)
- [ ] Mobile apps (React Native/Flutter)
- [ ] WebSocket real-time updates

### **Phase 4 Features:**
- [ ] Bank account linking
- [ ] Credit/debit card integration
- [ ] International transfers
- [ ] Tax reporting tools
- [ ] Advanced fraud detection

---


## 🙏 **Acknowledgments**

- **Node.js & Express Team** - Amazing backend framework
- **MongoDB Inc.** - Flexible NoSQL database
- **Open Source Community** - Libraries and tools used
- **Stack Overflow** - For countless solutions during development
- **You!** - For using/contributing to this project ❤️

---
