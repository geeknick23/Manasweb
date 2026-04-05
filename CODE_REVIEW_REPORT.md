# Manas Bandhan - Comprehensive Code Review Report

**Prepared:** February 3, 2026  
**Purpose:** Production Readiness Assessment  
**Mission:** Helping widows and marginalized women find dignified remarriage

---

## Executive Summary

This report documents a thorough code review of the Manas Bandhan platform comprising:
- **Flutter Mobile App** (`manas_bandhan/`)
- **Next.js Frontend Website** (`manas-frontend-main/`)
- **Next.js Admin Panel** (`manas-admin-main/`)
- **Node.js Backend** (`manas-backend-new-main/`)

### Overall Assessment: 🟡 **NEEDS WORK BEFORE PRODUCTION**

The codebase has solid foundations but contains **critical security vulnerabilities** and **production blockers** that must be addressed before deployment.

### 🔧 FIXES APPLIED (Feb 3, 2026)

| Issue | Status |
|-------|--------|
| Hardcoded API URL in Flutter | ✅ Fixed - Changed to production placeholder |
| Hardcoded IP in profile_card.dart | ✅ Fixed - Now uses configured base URL |
| Hardcoded height "5ft 5in" | ✅ Fixed - Removed (field not in model) |
| Insecure encryption (static salt) | ✅ Fixed - Random salt per encryption |
| JWT token logged to console | ✅ Fixed - Removed from admin panel |
| No rate limiting | ✅ Fixed - Added express-rate-limit |
| CORS wildcard in production | ✅ Fixed - Removed '*' from config |
| Volunteer GET endpoint unprotected | ✅ Fixed - Added auth middleware |
| In-memory OTP storage | ✅ Fixed - Now uses MongoDB with TTL |

---

## 🚨 CRITICAL ISSUES (Production Blockers)

### 1. **EXPOSED SECRETS IN .env.local FILE** ⚠️ CRITICAL
**File:** `manas-backend-new-main/manas-backend-new-main/.env.local`

The environment file is committed to the repository with REAL credentials:
```
MONGODB_URI=mongodb+srv://manasfoundation2025:3SmnsmoIhjAXhjc8@cluster0.7q5pqyf.mongodb.net/...
JWT_SECRET=31b63c0000e0210e7b9048708d9f7c57809b220cf54195c02e75f599007a6ffd...
SMTP_USER=manasfoundation2025@gmail.com
SMTP_PASS=jihkhtejzygvsuqz
```

**Impact:** 
- Database credentials exposed - anyone with repo access can read/modify/delete all user data
- JWT secret exposed - attackers can forge authentication tokens
- Email credentials exposed - can be used for spam/phishing

**Fix:**
1. Immediately rotate ALL credentials (MongoDB password, JWT secret, Gmail app password)
2. Remove `.env.local` from git tracking: `git rm --cached .env.local`
3. Add `.env.local` to `.gitignore`
4. Use environment variables in deployment (Vercel, Railway, etc.)

---

### 2. **Hardcoded Encryption Key for Messages**
**File:** `manas-backend-new-main/manas-backend-new-main/src/lib/encryption.js`

```javascript
const ENCRYPTION_KEY = process.env.MESSAGE_SECRET || 'manas_foundation_secret_key_32_b';
```

**Impact:** 
- If `MESSAGE_SECRET` env var is missing, all chat messages use a hardcoded key
- In production, messages would not be securely encrypted

**Fix:**
- Require `MESSAGE_SECRET` as mandatory environment variable
- Fail fast on startup if not set

---

### 3. **In-Memory OTP Storage for Admin**
**File:** `manas-backend-new-main/manas-backend-new-main/src/controllers/adminController.js`

```javascript
const otpStore = {};
```

**Impact:**
- Admin OTPs stored in memory, lost on server restart
- Not scalable for multiple server instances
- No proper cleanup mechanism

**Fix:**
- Store admin OTPs in MongoDB like user OTPs (OTP model already exists)
- Add TTL index for automatic expiration

---

### 4. **No Rate Limiting**
**Files:** All route files

**Impact:**
- OTP endpoints vulnerable to brute force attacks
- Login endpoint vulnerable to credential stuffing
- Registration endpoint vulnerable to spam registrations

**Fix:**
- Add `express-rate-limit` middleware
- Limit OTP requests to 3 per 10 minutes per email
- Limit login attempts to 5 per 15 minutes per IP

---

### 5. **Hardcoded API URL in Flutter App**
**File:** `manas_bandhan/lib/core/constants/constants.dart`

```dart
static const String baseUrl = String.fromEnvironment(
  'API_URL',
  defaultValue: 'http://192.168.50.10:5001',
);
```

**Impact:**
- Points to local development IP address
- Will fail in production if not overridden via `--dart-define`

**Fix:**
- Change default to production URL
- Document deployment build commands

---

### 6. **Volunteer Endpoint Has No Authentication**
**File:** `manas-backend-new-main/manas-backend-new-main/src/routes/volunteer.js`

```javascript
router.post('/', volunteerController.createVolunteer);
router.get('/', volunteerController.getVolunteers);
```

**Impact:**
- Anyone can submit unlimited volunteer forms (spam)
- Anyone can view all volunteer submissions (privacy breach)

**Fix:**
- Add CAPTCHA or rate limiting to POST
- Add admin authentication to GET endpoint

---

## 🔴 HIGH PRIORITY ISSUES

### 7. **No Password Reset Functionality**
**Impact:** Users who forget passwords are locked out permanently.

**Files Affected:** 
- `authController.js` - No forgot password endpoint
- All frontend login screens

**Fix:** Implement password reset flow with email token

---

### 8. **Duplicate Message Added to Stream**
**File:** `manas_bandhan/lib/data/repositories/chat_repository_impl.dart`

```dart
_messageController.add(message); // Add my own message to stream to update UI
_messageController.add(message); // Add my own message to stream to update UI
```

**Impact:** Every sent message appears twice in the chat.

**Fix:** Remove the duplicate `_messageController.add(message)` line.

---

### 9. **Missing Phone Number Validation**
**Files:** 
- `auth.js` (backend validation)
- `register_screen.dart` (Flutter)
- `register/page.tsx` (Frontend)

**Impact:** 
- Invalid phone numbers can be stored
- No verification that phone belongs to user

**Fix:**
- Add phone number format validation (Indian mobile: 10 digits)
- Consider SMS OTP verification for phone

---

### 10. **CORS Allows Wildcard in Production**
**File:** `manas-backend-new-main/manas-backend-new-main/src/index.js`

```javascript
const io = socketIo(server, {
  cors: {
    origin: [process.env.FRONTEND_URL, process.env.ADMIN_URL, '*'], // Allow all for dev if needed
```

**Impact:** In production, `'*'` may still be in the array, allowing any origin.

**Fix:** Remove `'*'` from production configuration or filter it out when `NODE_ENV=production`.

---

### 11. **Admin Routes Lack Role Verification**
**File:** `manas-backend-new-main/manas-backend-new-main/src/middleware/auth.js`

```javascript
if (decoded.isAdmin) {
  req.admin = { email: decoded.email, userId: decoded.userId };
  return next();
}
```

**Impact:** Any token with `isAdmin: true` is trusted. If an attacker obtains any admin token, they have full access.

**Fix:** Verify admin email exists in AdminUser collection on every request.

---

### 12. **Profile Photo Stored as Base64 in Database**
**Files:** Multiple

**Impact:**
- Large document sizes in MongoDB (base64 is ~33% larger than binary)
- Slow queries and increased memory usage
- MongoDB document size limit (16MB) can be hit easily with photos

**Fix:**
- Store photos in cloud storage (AWS S3, Cloudinary, or Firebase Storage)
- Store only URLs in database

---

### 13. **Email Containing Full Chat Message Content**
**File:** `manas-backend-new-main/manas-backend-new-main/src/services/emailService.js`

```javascript
const sendNewMessageEmail = async (senderName, receiverEmail, content) => {
  // ...
  <blockquote>${content}</blockquote>
```

**Impact:** 
- Private chat messages sent in plain text via email
- Email is not a secure channel
- Privacy violation

**Fix:**
- Send notification only, not message content
- "You have a new message from [Name]. Log in to view."

---

## 🟠 MEDIUM PRIORITY ISSUES

### 14. **TLS Certificate Verification Disabled**
**File:** `manas-backend-new-main/manas-backend-new-main/src/services/emailService.js`

```javascript
tls: {
  rejectUnauthorized: false
}
```

**Impact:** Vulnerable to man-in-the-middle attacks on email delivery.

**Fix:** Remove this line; Gmail's certificates are valid.

---

### 15. **Sensitive Data Logged to Console**
**File:** `manas-backend-new-main/manas-backend-new-main/src/services/emailService.js`

```javascript
console.log('SMTP_USER:', process.env.SMTP_USER);
console.log('SMTP_PASS:', process.env.SMTP_PASS);
```

**Impact:** Credentials printed to server logs.

**Fix:** Remove these debug log statements.

---

### 16. **State Hardcoded to Maharashtra**
**File:** `manas_bandhan/lib/presentation/screens/auth/register_screen.dart`

```dart
'state': 'Maharashtra',
```

**Impact:** Users from other states cannot register correctly.

**Fix:** Make state a user-selectable field.

---

### 17. **Limited District Options**
**File:** `manas_bandhan/lib/presentation/screens/auth/register_screen.dart`

```dart
items: ['Buldhana', 'Akola', 'Amravati', 'Washim', 'Yavatmal', 'Nagpur']
```

**Impact:** Only 6 districts available, limiting user registration.

**Fix:** Either make it a free text field or load districts from API.

---

### 18. **Demo Login Creates Fake User with Invalid Token**
**File:** `manas_bandhan/lib/presentation/blocs/auth/auth_bloc.dart`

```dart
await _prefs.setString(AppConstants.tokenKey, 'demo_token_12345');
```

**Impact:** 
- Demo token will fail on any API call
- Poor user experience
- Potential confusion

**Fix:** Either create real demo account on backend or clearly indicate demo limitations.

---

### 19. **Frontend Marital Status Enums Inconsistent**
**File:** `manas_bandhan/lib/data/models/user_model.dart`

```dart
enum MaritalStatus { 
  divorcee, widow, single,
  separated,  // Frontend-only
  neverMarried  // Frontend-only
}
```

**Impact:** Frontend shows options backend doesn't support, causing data loss.

**Fix:** Align frontend and backend enums; either remove extra options or add backend support.

---

### 20. **No Input Sanitization for HTML in Email Templates**
**File:** `manas-backend-new-main/manas-backend-new-main/src/services/emailService.js`

```javascript
<blockquote>${content}</blockquote>
```

**Impact:** HTML injection in chat messages could affect email rendering.

**Fix:** Escape HTML special characters in user content before embedding.

---

### 21. **Frontend Missing `.env.example`**
**Files:** 
- `manas-frontend-main/.env.local`
- `manas-admin-main/` (no env file documented)

**Impact:** New developers won't know required environment variables.

**Fix:** Create `.env.example` files with placeholder values.

---

### 22. **No Error Boundary in React Apps**
**Files:** Frontend and Admin Next.js apps

**Impact:** Unhandled errors crash the entire application.

**Fix:** Add React Error Boundary components.

---

### 23. **Backend Port Defined Twice**
**File:** `manas-backend-new-main/manas-backend-new-main/.env.local`

```
PORT=5000
PORT=5000 
```

**Impact:** Minor; no functional issue but indicates sloppy configuration.

**Fix:** Remove duplicate line.

---

## 🟢 LOW PRIORITY / IMPROVEMENTS

### 24. **Missing API Documentation**
- Swagger is configured but routes aren't documented with JSDoc comments
- No README in backend folder explaining API endpoints

### 25. **No Unit Tests**
- Flutter: `widget_test.dart` is boilerplate only
- Backend: No test files present
- Frontend: No test configuration

### 26. **Incomplete Bank Details for Donations**
**File:** `manas_bandhan/lib/core/constants/constants.dart`

```dart
static const String accountNumber = 'XXXXXXXXXXXX'; // To be filled
static const String ifscCode = 'SBIN0XXXXXX'; // To be filled
static const String upiId = 'manasfoundation@sbi'; // To be filled
```

### 27. **Console.log Statements Throughout Codebase**
Multiple debug statements in production code across all projects.

### 28. **Missing Image Assets**
- `no-profile-pic.png` and `no-profile-pic.svg` referenced but may not exist

### 29. **Unused Import in Dart File**
**File:** `chat_screen.dart`
```dart
import '../../blocs/auth/auth_bloc.dart';
```
Not used in the file.

### 30. **Missing Privacy Policy and Terms of Service Pages**
Links exist in registration but pages are not implemented.

---

## 🔐 SECURITY CONCERNS SUMMARY

| Issue | Severity | Status |
|-------|----------|--------|
| Exposed database credentials | 🚨 Critical | Must Fix |
| Exposed JWT secret | 🚨 Critical | Must Fix |
| Exposed SMTP password | 🚨 Critical | Must Fix |
| Hardcoded encryption key | 🚨 Critical | Must Fix |
| No rate limiting | 🔴 High | Must Fix |
| In-memory admin OTP storage | 🔴 High | Must Fix |
| No password reset | 🔴 High | Should Fix |
| TLS verification disabled | 🟠 Medium | Should Fix |
| Credentials logged to console | 🟠 Medium | Should Fix |
| No input sanitization in emails | 🟠 Medium | Should Fix |
| Volunteer endpoint unprotected | 🔴 High | Must Fix |

---

## ✅ PRODUCTION READINESS CHECKLIST

### Before Production Launch

- [ ] **IMMEDIATE:** Rotate ALL exposed credentials
- [ ] Remove `.env.local` from git history and add to `.gitignore`
- [ ] Set `MESSAGE_SECRET` environment variable
- [ ] Implement rate limiting on all authentication endpoints
- [ ] Move admin OTPs to MongoDB
- [ ] Add authentication to volunteer GET endpoint
- [ ] Update Flutter API URL default to production
- [ ] Remove debug console.log statements
- [ ] Fix duplicate message bug in chat repository
- [ ] Implement password reset functionality
- [ ] Remove CORS wildcard in production

### Recommended Before Launch

- [ ] Migrate profile photos to cloud storage
- [ ] Add React Error Boundaries
- [ ] Remove chat content from email notifications
- [ ] Enable TLS certificate verification
- [ ] Add unit tests for critical paths
- [ ] Create deployment documentation
- [ ] Add `.env.example` files

### Post-Launch Improvements

- [ ] Add comprehensive API documentation
- [ ] Implement SMS verification for phone numbers
- [ ] Add Sentry or similar error monitoring
- [ ] Set up database backups
- [ ] Implement audit logging for admin actions
- [ ] Add Privacy Policy and Terms of Service pages
- [ ] Complete bank details for donations

---

## 👏 POSITIVE OBSERVATIONS

Despite the issues, the codebase has several strengths:

1. **Good Architecture:** Clean separation of concerns with BLoC pattern in Flutter
2. **Type Safety:** Zod validation on backend, TypeScript on frontend
3. **Localization Support:** Multi-language setup in Flutter (English/Marathi)
4. **End-to-End Encryption:** Chat messages are encrypted (with proper key management, this is good)
5. **Real-time Features:** Socket.io properly implemented for chat
6. **Clean UI Components:** Well-structured component libraries
7. **Pagination Support:** Profile listing has proper pagination
8. **Interest Matching:** Core matrimonial matching functionality works

---

## CONCLUSION

The Manas Bandhan platform serves a **noble cause** - helping widows and marginalized women find dignified remarriage. The application has solid foundations and functional features.

However, **critical security issues MUST be addressed** before production deployment. The exposed credentials represent an immediate risk and should be rotated today.

With the issues in this report addressed, the platform can be safely deployed to serve its intended community.

---

*Report generated by comprehensive code review on February 3, 2026*
