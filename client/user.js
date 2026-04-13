/**
 * ============================================
 * PAYMENT SYSTEM - FRONTEND API CLIENT
 * Backend URL: http://localhost:5000/
 * Enhanced Version: v2.0
 * ============================================
 */

// ================= CONFIGURATION =================
const API_BASE_URL = 'http://localhost:5000/api';

// ================= AUTHENTICATION FUNCTIONS =================

/**
 * Register a new user
 */
async function registerUser(email, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        return await response.json();
    } catch (error) {
        console.error('[REGISTER ERROR]', error);
        return { message: 'Network error. Unable to connect to server.' };
    }
}

/**
 * Login user and get JWT token
 */
async function loginUser(email, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();

        if (data.token) {
            localStorage.setItem('token', data.token);
            console.log('[LOGIN] ✅ Token saved successfully');
        }
        return data;
    } catch (error) {
        console.error('[LOGIN ERROR]', error);
        return { message: 'Network error. Unable to connect to server.' };
    }
}

/**
 * Get current authenticated user's data
 */
async function getCurrentUser() {
    const token = getAuthToken();
    if (!token) return null;

    try {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
            method: 'GET',
            headers: { 'Authorization': token, 'Content-Type': 'application/json' }
        });

        if (response.status === 401) {
            logoutUser();
            return null;
        }

        const data = await response.json();
        console.log('[GET USER] ✅ User data loaded:', data);
        return data;
    } catch (error) {
        console.error('[GET USER ERROR]', error);
        return null;
    }
}

/**
 * Setup/Update user profile
 */
async function setupProfile(name, age, imageFile = null) {
    const token = getAuthToken();
    if (!token) return { message: 'Not authenticated' };

    try {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('age', age);
        if (imageFile) formData.append('image', imageFile);

        const response = await fetch(`${API_BASE_URL}/auth/setup-profile`, {
            method: 'POST',
            headers: { 'Authorization': token },
            body: formData
        });
        return await response.json();
    } catch (error) {
        console.error('[SETUP PROFILE ERROR]', error);
        return { message: 'Network error while setting up profile.' };
    }
}

// ================= PAYMENT FUNCTIONS =================

/**
 * Set security PIN for transactions
 */
async function setSecurityPin(pin) {
    const token = getAuthToken();
    if (!token) return { message: 'Not authenticated' };

    try {
        const response = await fetch(`${API_BASE_URL}/payment/set-pin`, {
            method: 'POST',
            headers: { 'Authorization': token, 'Content-Type': 'application/json' },
            body: JSON.stringify({ pin })
        });
        return await response.json();
    } catch (error) {
        console.error('[SET PIN ERROR]', error);
        return { message: 'Error setting PIN.' };
    }
}

/**
 * Send money to another user
 */
async function sendMoney(toPayId, amount, pin) {
    const token = getAuthToken();
    if (!token) return { message: 'Not authenticated' };

    try {
        const response = await fetch(`${API_BASE_URL}/payment/send`, {
            method: 'POST',
            headers: { 'Authorization': token, 'Content-Type': 'application/json' },
            body: JSON.stringify({ toPayId: toPayId.trim(), amount: Number(amount), pin: pin.toString() })
        });
        return await response.json();
    } catch (error) {
        console.error('[SEND MONEY ERROR]', error);
        return { message: 'Transaction failed. Network error.' };
    }
}

/**
 * Get ALL transaction history (both sent & received)
 */
async function getTransactionHistory() {
    const token = getAuthToken();
    if (!token) return [];

    try {
        const response = await fetch(`${API_BASE_URL}/payment/history`, {
            method: 'GET',
            headers: { 'Authorization': token, 'Content-Type': 'application/json' }
        });
        const data = await response.json();
        console.log('[HISTORY] Loaded', Array.isArray(data) ? data.length : 0, 'transactions');
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error('[HISTORY ERROR]', error);
        return [];
    }
}

/**
 * ⭐ NEW: Filter only SENT transactions
 */
function filterSentTransactions(transactions) {
    if (!Array.isArray(transactions)) return [];
    return transactions.filter(tx => tx.type === 'sent');
}

/**
 * ⭐ NEW: Filter only RECEIVED transactions
 */
function filterReceivedTransactions(transactions) {
    if (!Array.isArray(transactions)) return [];
    return transactions.filter(tx => tx.type === 'received');
}

/**
 * Get QR code for receiving payments
 */
async function getQRCode() {
    const token = getAuthToken();
    if (!token) return null;

    try {
        const response = await fetch(`${API_BASE_URL}/payment/qr`, {
            method: 'GET',
            headers: { 'Authorization': token, 'Content-Type': 'application/json' }
        });
        const data = await response.json();
        return data.qr || null;
    } catch (error) {
        console.error('[QR CODE ERROR]', error);
        return null;
    }
}

/**
 * Look up user by Pay ID
 */
async function lookupUserByPayId(payId) {
    try {
        const response = await fetch(`${API_BASE_URL}/payment/user/${encodeURIComponent(payId.trim())}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        return await response.json();
    } catch (error) {
        console.error('[LOOKUP USER ERROR]', error);
        return { message: 'Error looking up user.' };
    }
}

// ================= UTILITY FUNCTIONS =================

/** Get auth token from localStorage */
function getAuthToken() {
    return localStorage.getItem('token');
}

/** Logout user and clear session */
function logoutUser() {
    console.log('[LOGOUT] 👋 User logged out');
    localStorage.removeItem('token');
    window.location.href = 'index.html';
}

/** Format currency amount */
function formatCurrency(amount) {
    const num = Number(amount);
    if (isNaN(num)) return '$0.00';
    return '$' + num.toFixed(2);
}

/** Format date to readable string */
function formatDate(dateString) {
    try {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return date.toLocaleDateString('en-US', options);
    } catch (error) {
        return 'Invalid Date';
    }
}

/** Show notification toast */
function showNotification(message, type = 'info', duration = 4000) {
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    
    const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
    toast.innerHTML = `
        <span class="toast-icon">${icons[type] || icons.info}</span>
        <span class="toast-message">${message}</span>
        <button class="toast-close" onclick="this.parentElement.remove()">×</button>
    `;

    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

/** Copy text to clipboard */
function copyToClipboard(text) {
    if (text === 'Not Set') {
        showNotification('No Pay ID to copy', 'warning');
        return;
    }
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Copied: ' + text, 'success', 2000);
    }).catch(err => {
        showNotification('Failed to copy', 'error');
    });
}