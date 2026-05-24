# Digital Electoral Ballot Poll - Quick Start Guide

## 🚀 Getting Started in 2 Minutes

### Step 1: Open the Website
1. Navigate to the project folder: `DIGITAL ELECTORAL BALLOT POLL`
2. Open `welcome-page.html` in your web browser
3. You should see the landing page with election information

### Step 2: Login or Register

#### Option A: Login as Demo User
- Click **"Sign In"** button
- Username: `admin`
- Password: `admin123`
- Click **"Sign In"**
- You'll be directed to the Admin Dashboard

#### Option B: Create New Account
- Click **"Create New Account"** link
- Fill in all required information:
  - Full Name, Age, Gender
  - Address, City, State
  - Phone, Email, NIMC ID
  - Username & Password
- Click **"Create New Account"**
- Login with your new credentials

### Step 3: Navigate the System

#### For Regular Voters:
1. **Vote** (`voting-page.html`) - Cast your vote for a candidate
2. **Results** (`results.html`) - View real-time election results
3. **Candidates** (`candidates.html`) - Browse all candidates
4. **Profile** (`profile.html`) - View/manage your information
5. **Community** (`community.html`) - Join discussions
6. **Support** (`support.html`) - Submit support tickets

#### For Administrators (login as `admin`):
1. **Dashboard** (`dashboard.html`) - View election statistics
2. **KYC Management** (`kyc-admin.html`) - Verify user information
3. **Candidate Management** (`admin-candidates.html`) - Add/edit candidates
4. **Settings** (`settings.html`) - Admin controls

---

## 📍 Key Features

### Voting
- Cast a vote once per account
- View live vote counts
- See real-time results

### User Management (Admin)
- View all registered users
- Search users by username/email/NIMC
- Filter by KYC status (Pending/Verified/Rejected)
- Approve or reject user registrations
- View detailed user profiles

### Candidates
- View all candidates with their running mates
- See vote counts for each candidate
- Admin can add/edit/remove candidates

### Results
- Real-time vote counting
- Multiple chart visualizations
- Vote percentage breakdown
- Demographic analysis

---

## 💾 Data Persistence

All your data is automatically saved to your browser:
- ✓ Your votes are saved
- ✓ Your profile is saved
- ✓ Your account is saved
- ✓ Election data is saved

**Note:** Clearing browser cache will delete all data.

---

## 🎯 Complete User Journey

### New User (Voter):
1. Open website
2. Click "Sign Up"
3. Fill in registration form
4. Click "Create Account"
5. Login with credentials
6. Browse candidates
7. Cast your vote
8. View results
9. Update profile if needed
10. Join community discussions

### Admin User:
1. Login as `admin` / `admin123`
2. View Dashboard with stats
3. Go to KYC Management
4. Review user applications
5. Approve/Reject users
6. Manage candidates
7. Monitor voting progress
8. Export user data

---

## 🔧 Troubleshooting

### "Please log in to vote"
- You're not logged in
- Solution: Click Sign In and login first

### "You have already voted"
- You already cast your vote
- Each account can only vote once
- Solution: View results or browse other sections

### Data not saving
- JavaScript might be disabled
- LocalStorage might be full
- Solution: Clear browser cache or use private browsing

### Forgot password?
- Click "Forgot your password?" on login page
- Enter your username
- Set a new password
- Login with new password

---

## 👥 Test Accounts

| Username | Password | Role | Status |
|----------|----------|------|--------|
| admin | admin123 | Admin | Pre-created |
| user | user123 | Voter | Pre-created |

**Create your own account** using the Sign Up page!

---

## 📊 Dashboard Overview

The Admin Dashboard shows:
- 📈 Total votes cast
- 👥 Registered voters
- 🗳️ Voter turnout percentage
- 📋 Active candidates
- 📊 Vote distribution charts
- 📉 Statistical analysis

---

## 🔐 Security Notes

**For Demo Purposes:**
- Passwords are visible (not hashed)
- Data stored locally (not encrypted)
- No login session timeout

**In Production:**
- Use encrypted HTTPS
- Hash passwords with bcrypt
- Implement session tokens
- Add rate limiting
- Regular security audits

---

## 📝 Available Pages

| Page | Purpose | Access |
|------|---------|--------|
| Welcome | Landing page | Public |
| Login | User authentication | Public |
| Sign Up | Create new account | Public |
| Forgotten Password | Password recovery | Public |
| Voting | Cast votes | Logged in users |
| Results | View election results | Public |
| Dashboard | Admin statistics | Admin only |
| KYC Admin | User verification | Admin only |
| Candidates | Browse candidates | Public |
| Profile | User information | Logged in users |
| Settings | Account settings | Logged in users |
| Community | Forum discussions | Logged in users |
| Support | Support tickets | Everyone |

---

## 💡 Tips & Tricks

1. **Incognito Mode:** Test multiple accounts without logging out
2. **Export Data:** Admins can export all user data
3. **Real-time Updates:** Votes update instantly
4. **Search Users:** Use the search bar in KYC management
5. **Vote Count:** See live vote counts on candidate cards

---

## ❓ FAQ

**Q: Can I vote twice?**  
A: No, the system only allows one vote per account.

**Q: Can I change my vote?**  
A: No, votes are permanent. Each account can only vote once.

**Q: How do I become an admin?**  
A: Login with demo admin credentials (admin/admin123) for testing.

**Q: Where is my data stored?**  
A: In your browser's localStorage. It persists until cleared.

**Q: Can I export results?**  
A: Admins can export user data from the Dashboard.

**Q: What if I forget my password?**  
A: Use the "Forgot Password" link on the login page.

---

## 🆘 Need Help?

1. Visit the **Support** page
2. Check the **Community** forum
3. Review the **COMPLETE_DOCUMENTATION.md** file
4. Check the **QUICK_REFERENCE.md** file

---

## ✅ Verification Checklist

After opening the website, verify:
- [ ] Welcome page loads correctly
- [ ] Can login with demo credentials
- [ ] Can create new account
- [ ] Can cast a vote
- [ ] Results display correctly
- [ ] Profile page shows user info
- [ ] Admin dashboard accessible
- [ ] KYC page shows user list
- [ ] Candidates display with images
- [ ] Community posts work
- [ ] Support form accepts submissions

---

## 📞 Contact & Support

**For technical support:**
- Use the Support page in the application
- Submit issues through Community forum

**For documentation:**
- See COMPLETE_DOCUMENTATION.md
- See QUICK_REFERENCE.md
- Check HOME_PAGE_SETUP.md

---

**Welcome to Digital Electoral Ballot Poll! 🗳️**

*Your vote matters. Your voice counts.*

---

**© 2026 Digital Electoral Ballot Poll. All rights reserved.**  
*Powered by Chalcedony Technologies Inc.*
