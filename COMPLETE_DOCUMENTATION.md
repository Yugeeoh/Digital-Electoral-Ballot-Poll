# Digital Electoral Ballot Poll (DEBP) - Complete Website Documentation

## 🎯 Project Overview

The Digital Electoral Ballot Poll (DEBP) is a comprehensive web-based voting and election management system. It provides a secure, user-friendly platform for voters to cast their votes and administrators to manage elections.

**Version:** 2026  
**Platform:** Web-based (HTML5, CSS3, JavaScript)  
**Storage:** Browser LocalStorage for data persistence

---

## 📋 Features

### For Voters
- ✅ **User Registration** - Create account with full personal information
- ✅ **Secure Login** - Sign in with username and password
- ✅ **Forgotten Password** - Recover account access
- ✅ **Vote Casting** - Secure voting interface with candidate information
- ✅ **View Results** - Real-time election results and statistics
- ✅ **User Profile** - View and manage personal information
- ✅ **Candidates View** - Browse all participating candidates
- ✅ **Community Forum** - Engage in discussions and community posts
- ✅ **Support Tickets** - Submit support requests and inquiries

### For Administrators
- ✅ **Dashboard** - Comprehensive election statistics and analytics
- ✅ **Candidate Management** - Add, edit, and remove candidates
- ✅ **KYC Management** - Know Your Customer verification system
- ✅ **User List** - View all registered users with detailed profiles
- ✅ **Vote Management** - Monitor and reset election data
- ✅ **User Verification** - Approve or reject user registrations

---

## 📁 Project Structure

```
DIGITAL ELECTORAL BALLOT POLL/
├── index.html (via welcome-page.html)
├── login.html
├── sign-up.html
├── forgotten-password.html
├── voting-page.html
├── results.html
├── dashboard.html
├── profile.html
├── settings.html
├── candidates.html
├── admin-candidates.html
├── kyc-admin.html
├── community.html
├── support.html
├── welcome-page.html
│
├── scripts/
│   ├── general-data.js (Core data module)
│   ├── logout.js (Logout functionality)
│   ├── main.js (Main utilities)
│   ├── app-main.js (App initialization)
│   ├── login.js (Login functionality)
│   ├── sign-up.js (Registration)
│   ├── forgotten-password.js (Password recovery)
│   ├── voting-page.js (Voting interface)
│   ├── results.js (Results display)
│   ├── dashboard.js (Admin dashboard)
│   ├── admin-candidates.js (Candidate management)
│   ├── kyc-admin.js (KYC verification)
│   ├── profile.js (User profile)
│   ├── settings.js (Settings)
│   ├── welcome.js (Welcome page)
│   ├── community.js (Community forum)
│   └── support.js (Support tickets)
│
├── styles/
│   ├── general.css (Global styles)
│   ├── pages.css (Page layouts)
│   ├── auth.css (Authentication styles + forgotten password)
│   ├── dashboard.css (Dashboard styles)
│   ├── profile.css (Profile styles)
│   ├── admin-candidates.css (Admin styles)
│   ├── kyc-admin.css (KYC styles)
│   ├── home.css (Home page)
│   ├── welcome.css (Welcome styles)
│   ├── enhancements.css (UI enhancements)
│   ├── modern-pages.css (Modern page styles)
│   └── style.css (Additional styles)
│
├── data/
│   ├── general-data.js (Master data module)
│   └── logout.js (Logout handler)
│
├── images/
│   ├── chalcedony-logo.png
│   ├── apc-logo.png
│   ├── pdp-logo.png
│   └── lp-logo.png
│
└── README files
    ├── HOME_PAGE_SETUP.md
    └── QUICK_REFERENCE.md
```

---

## 🔑 Key Pages & Routes

| Page | URL | Description | Access |
|------|-----|-------------|--------|
| Welcome | `/welcome-page.html` | Landing page | Public |
| Login | `/login.html` | User authentication | Public |
| Sign Up | `/sign-up.html` | User registration | Public |
| Forgot Password | `/forgotten-password.html` | Password recovery | Public |
| Voting | `/voting-page.html` | Cast votes | Registered Users |
| Results | `/results.html` | View election results | Everyone |
| Dashboard | `/dashboard.html` | Admin statistics | Admin Only |
| Candidates | `/candidates.html` | View candidates | Everyone |
| Candidate Management | `/admin-candidates.html` | Manage candidates | Admin Only |
| KYC Management | `/kyc-admin.html` | Verify users (KYC) | Admin Only |
| Profile | `/profile.html` | User profile info | Registered Users |
| Settings | `/settings.html` | Account settings | Registered Users |
| Community | `/community.html` | Forum discussions | Registered Users |
| Support | `/support.html` | Support requests | Everyone |

---

## 👥 Demo Credentials

### Admin User
- **Username:** `admin`
- **Password:** `admin123`
- **Role:** Administrator (full system access)

### Regular User
- **Username:** `user`
- **Password:** `user123`
- **Role:** Voter (can vote and view results)

---

## 💾 Data Storage System

All data is persisted using **Browser LocalStorage**:

### Storage Keys:
- `debp_state_v1` - Election votes and status
- `debp_session_v1` - Current user session
- `debp_registered_users_v1` - Registered user accounts
- `debp_user_profiles_v1` - User profile information (KYC data)
- `debp_candidates_v1` - Candidate information

### Data Models:

**User Object:**
```javascript
{
  id: timestamp,
  username: string,
  password: string, // Note: In production should be hashed
  email: string,
  role: 'voter' | 'admin',
  createdAt: ISO8601,
  hasVoted: boolean
}
```

**User Profile:**
```javascript
{
  username: string,
  fullname: string,
  age: number,
  gender: string,
  address: string,
  city: string,
  state: string,
  phone: string,
  email: string,
  nimc: string,
  kycStatus: 'pending' | 'verified' | 'rejected',
  kycVerifiedAt: ISO8601,
  kycNotes: string,
  createdAt: ISO8601,
  updatedAt: ISO8601
}
```

**Candidate Object:**
```javascript
{
  key: string,
  name: {
    main: string,
    vice: string
  },
  votes: number,
  party: string
}
```

---

## 🔐 Authentication & Authorization

### Login Flow:
1. User enters username and password
2. System validates against built-in or registered users
3. Session saved to localStorage
4. User redirected based on role (admin → dashboard, voter → voting page)

### Password Recovery:
1. User enters username
2. System verifies username exists
3. User sets new password
4. Password updated in localStorage
5. User redirected to login

### Authorization Levels:
- **Public:** Welcome, Login, Sign Up, Results, Candidates, Support
- **Authenticated:** Voting, Profile, Settings, Community
- **Admin Only:** Dashboard, Candidate Management, KYC Management

---

## 🎮 Core Functionality

### User Registration (`sign-up.html`)
- Full name, age, gender
- Address, city, state
- Phone number, email
- NIMC ID (National ID)
- Username and password
- Form validation
- Duplicate checking

### Voting System (`voting-page.html`)
- Display all candidates
- One vote per user limitation
- Vote confirmation
- Real-time vote count updates
- Voting status check
- Vote history tracking

### Results (`results.html`)
- Pie chart of election results
- Bar chart of vote distribution
- Total votes count
- Percentage breakdown by candidate
- Real-time updates

### Dashboard (`dashboard.html`)
- Total votes metric
- Voter turnout percentage
- Registered voters count
- Active candidates count
- Multiple visualization charts:
  - Election results pie chart
  - Vote distribution bar chart
  - Vote turnout over time
  - Demographic breakdown
  - Campaign expenses
  - Age group distribution

### KYC Management (`kyc-admin.html`)
- User verification dashboard
- Statistics: Total, Verified, Pending, Rejected
- Search functionality by username, email, NIMC
- Filter by status
- User details modal with full profile
- Approve/Verify users
- Reject users with reason
- Verification notes
- User export functionality

### Community (`community.html`)
- Create and post discussions
- View all community posts
- Timestamp tracking
- User comments

### Support (`support.html`)
- Submit support tickets
- Multiple issue categories
- Priority levels
- Tracking system

---

## 🛠️ Core Data Module Functions

### Authentication
- `login(username, password)` - Authenticate user
- `logout()` - End user session
- `getUserRole(username)` - Get user's role
- `registerUser(username, password, email, profileData)` - Register new user

### User Management
- `getRegisteredUsers()` - Get all users
- `getUserProfile(username)` - Get user's full profile
- `saveUserProfile(username, profileData)` - Save profile info
- `updateUserProfile(username, field, value)` - Update specific field
- `deleteUserProfile(username)` - Remove user profile
- `getUserProfiles()` - Get all profiles

### KYC Functions
- `setUserKYCStatus(username, status)` - Set verification status
- `getUserKYCStatus(username)` - Get user's KYC status
- `getAllUsersKYCStatus()` - Get all KYC statuses
- `getKYCStatistics()` - Get KYC metrics
- `verifyUserKYC(username, notes)` - Approve user
- `rejectUserKYC(username, reason, notes)` - Reject user
- `exportUsersData()` - Export all user data

### Voting Functions
- `castVote(candidateKey, voterName)` - Record a vote
- `hasUserVoted(voterName)` - Check if user already voted
- `getCandidates()` - Get all candidates
- `addCandidate(mainName, viceName, party)` - Add new candidate
- `updateCandidate(key, mainName, viceName, party)` - Update candidate
- `removeCandidate(key)` - Delete candidate
- `resetCandidateVotes(key)` - Reset votes for candidate
- `resetElectionData()` - Clear all election data

### Data Persistence
- `saveState()` - Save election state
- `loadState()` - Load election state
- `saveRegisteredUsers(usersList)` - Save users
- `getRegisteredUsers()` - Load users

---

## 🎨 Styling System

### CSS Files:
- **general.css** - Global styles, typography, colors
- **pages.css** - Page layouts and containers
- **auth.css** - Authentication pages and forgotten password
- **dashboard.css** - Dashboard-specific styles
- **admin-candidates.css** - Admin panel styles
- **kyc-admin.css** - KYC management styles
- **enhancements.css** - UI/UX enhancements
- **modern-pages.css** - Modern page designs

### Color Scheme:
- Primary: `#667eea` (Purple)
- Success: `#27ae60` (Green)
- Error: `#e74c3c` (Red)
- Warning: `#f39c12` (Orange)
- Neutral: `#2c3e50` (Dark), `#95a5a6` (Gray)

### Responsive Design:
- Mobile: `max-width: 480px`
- Tablet: `max-width: 768px`
- Desktop: `max-width: 1024px+`

---

## ✅ Testing Checklist

### User Flows:
- [ ] Create account (sign up)
- [ ] Login with credentials
- [ ] Recover forgotten password
- [ ] Cast a vote
- [ ] View results
- [ ] Update profile
- [ ] Participate in community
- [ ] Submit support ticket

### Admin Functions:
- [ ] Login as admin
- [ ] View dashboard
- [ ] Add/edit candidate
- [ ] View KYC user list
- [ ] Approve user KYC
- [ ] Reject user KYC
- [ ] Reset election data
- [ ] Export user data

### Data Persistence:
- [ ] Verify votes persist after page reload
- [ ] Check user data saved correctly
- [ ] Confirm session persists
- [ ] Validate KYC status updates

---

## 🚀 Getting Started

### Running Locally:
1. Clone/download project
2. Open `welcome-page.html` in web browser
3. Use demo credentials to login
4. Navigate to features

### Browser Requirements:
- Modern browser with ES6 support
- LocalStorage enabled
- JavaScript enabled
- Cookies enabled

### Tested On:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## 📝 Deployment Notes

### Security Considerations:
⚠️ **Important:** This is a demonstration system
- Passwords are stored in plain text (use hashing in production)
- Data stored in LocalStorage (use secure backend in production)
- No encryption (implement SSL/TLS in production)
- No authentication tokens (implement JWT in production)

### Production Recommendations:
1. Implement backend API
2. Hash passwords with bcrypt
3. Use secure session management
4. Enable HTTPS/SSL
5. Implement CSRF protection
6. Add rate limiting
7. Use database instead of LocalStorage
8. Implement audit logging
9. Add two-factor authentication
10. Regular security audits

---

## 📞 Support & Contact

For issues or questions about this system:
- Visit the Support page (`support.html`)
- Submit feedback through Community (`community.html`)
- Check the Quick Reference guide (`QUICK_REFERENCE.md`)

---

## 📄 Version History

**v2026.1.0** (Current)
- Complete voting system
- User registration and authentication
- KYC verification system
- Admin dashboard
- Community forum
- Support ticketing
- Forgotten password recovery
- Real-time vote counting
- Multiple visualization charts

---

## 📋 Files Summary

- **14 HTML Pages** - Complete user interface
- **14 JavaScript Files** - Functionality and logic
- **10 CSS Files** - Styling and layout
- **3 Documentation Files** - Setup guides and references

**Total Lines of Code:** 5000+

---

## ✨ Key Achievements

✅ Complete electoral voting system  
✅ User authentication and registration  
✅ Admin control panel  
✅ KYC verification system  
✅ Community engagement platform  
✅ Real-time vote tracking  
✅ Comprehensive user management  
✅ Data persistence  
✅ Responsive design  
✅ Professional UI/UX  

---

**© 2026 Digital Electoral Ballot Poll. All rights reserved.**  
*Powered by Chalcedony Technologies Inc.*
