export let presCand ={
 candA:{
    name:{
     main:'Bola Ahmed Tinubu',
     vice:'Kashim Shettima'
    },
  votes: 0,
  party:'APC',
  photo: 'https://via.placeholder.com/250x250?text=Bola+Tinubu',
  vicePhoto: 'https://via.placeholder.com/250x250?text=Kashim+Shettima',
  mainBio: 'Bola Ahmed Tinubu is a prominent Nigerian politician and businessman who served as the Governor of Lagos State from 1999 to 2007. He is known for his economic policies and contributions to Nigeria\'s development.',
  viceBio: 'Kashim Shettima is an accomplished administrator who served as the Governor of Borno State. He is recognized for his efforts in infrastructure development and public service.',
  mainMemoir: 'With over three decades of political experience, Tinubu has championed democratic values and economic growth. His administration implemented progressive policies that transformed Lagos into a model state.',
  viceMemoir: 'Shettima\'s career spans military service and civilian administration, focusing on security, education, and economic development. He is dedicated to building a united and prosperous Nigeria.',
  partyLogo: 'images/apc-logo.png'
}, 
  candB:{
  name:{
    main:'Ebele Goodluck Jonathan',
    vice:'Atiku Abubakar'
  },
  votes: 0,
  party:'PDP',
  photo: 'https://via.placeholder.com/250x250?text=Goodluck+Jonathan',
  vicePhoto: 'https://via.placeholder.com/250x250?text=Atiku+Abubakar',
  mainBio: 'Goodluck Jonathan served as President of Nigeria from 2010 to 2015. He is recognized for his efforts in infrastructure development, education, and democratic reforms.',
  viceBio: 'Atiku Abubakar is a successful businessman and political figure with extensive experience in public service. He is known for his advocacy for national unity and economic development.',
  mainMemoir: 'Jonathan\'s presidency focused on transforming Nigeria\'s infrastructure and improving citizens\' welfare. His administration implemented critical economic policies and promoted democratic stability.',
  viceMemoir: 'With decades of experience in business and politics, Abubakar has consistently advocated for good governance, sustainable development, and social inclusion across Nigeria.',
  partyLogo: 'images/pdp-logo.png'
}, 
 candC:{
  name:{
    main:'Peter Obi',
    vice:'Yusuf Datti Baba-Ahmed'
  },
  votes: 0,
  party:'LP',
  photo: 'https://via.placeholder.com/250x250?text=Peter+Obi',
  vicePhoto: 'https://via.placeholder.com/250x250?text=Yusuf+Datti',
  mainBio: 'Peter Obi is a renowned entrepreneur and former Governor of Anambra State. He is known for his business acumen and commitment to anti-corruption efforts and economic development.',
  viceBio: 'Yusuf Datti Baba-Ahmed is an accomplished businessman and philanthropist dedicated to education and rural development. He brings a wealth of private sector experience to public service.',
  mainMemoir: 'Obi\'s career combines successful business ventures with public service, focusing on fiscal responsibility, infrastructure, and human capital development. He advocates for transparency and good governance.',
  viceMemoir: 'Baba-Ahmed\'s commitment to social development is evident through his philanthropic initiatives in education and community development. He champions inclusive growth and sustainable prosperity.',
  partyLogo: 'images/lp-logo.png'
}}

export let parties = {
  partyA:{
    name:'All Progressives Congress',
    acronym:'APC',
    logo:'images/apc-logo.png'
  },partyB:{
    name:'Peoples Democratic Party',
    acronym:'PDP',
    logo:'images/pdp-logo.png'
  },partyC:{
    name:'Labour Party',
    acronym:'LP',
    logo:'images/lp-logo.png'
  }
}
export let users = {
  adminUser:{
    username:'admin',password:'admin123',email:'admin@debp.local',role:'admin',createdAt:'2024-01-01'
  },
  generalUser:{
    username:'user',password:'user123',email:'user@debp.local',role:'voter',createdAt:'2024-01-01'
  }
}

// Storage key for registered users
const USERS_STORAGE_KEY = 'debp_registered_users_v1';
const VOTING_SCHEDULE_KEY = 'debp_voting_schedule_v1';

export let totalVotes = 0;
export let votingStatus = 'closed';
export let currentUser = null;
export let votingHistory = [];
export let communityPosts = [];
export let supportMessages = [];
export let votingSchedule = {
  startDate: null,
  startTime: null,
  endDate: null,
  endTime: null
};
export let dashboardStats = {
  totalVoters: 0,
  totalCandidates: 3,
  totalParties: 3
}
// Persist/load state to localStorage so votes survive page navigation
const STORAGE_KEY = 'debp_state_v1';

function saveState() {
  try {
    const state = {
      presCand: {
        candA: { votes: presCand.candA.votes },
        candB: { votes: presCand.candB.votes },
        candC: { votes: presCand.candC.votes }
      },
      totalVotes,
      votingHistory
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Could not save state', e);
  }
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const state = JSON.parse(raw);
    if (state && state.presCand) {
      if (typeof state.presCand.candA?.votes === 'number') presCand.candA.votes = state.presCand.candA.votes;
      if (typeof state.presCand.candB?.votes === 'number') presCand.candB.votes = state.presCand.candB.votes;
      if (typeof state.presCand.candC?.votes === 'number') presCand.candC.votes = state.presCand.candC.votes;
    }
    if (typeof state.totalVotes === 'number') totalVotes = state.totalVotes;
    if (Array.isArray(state.votingHistory)) votingHistory = state.votingHistory;
  } catch (e) {
    console.warn('Could not load state', e);
  }
}

// attempt to restore previous state on module load
loadState();
// load voting schedule from storage
loadVotingSchedule();
// load session if present
function loadSession() {
  try {
    const raw = localStorage.getItem('debp_session_v1');
    if (!raw) return;
    const s = JSON.parse(raw);
    if (s && s.username) {
      currentUser = s.username;
    }
  } catch (e) {
    console.warn('Could not load session', e);
  }
}
loadSession();

function saveSession(user) {
  try {
    localStorage.setItem('debp_session_v1', JSON.stringify({ username: user }));
  } catch (e) { console.warn('Could not save session', e); }
}

export function login(username, password) {
  // Check built-in users first
  if (!username || !password) return false;
  let u = Object.values(users).find(x => x.username === username && x.password === password);
  
  // If not found, check registered users
  if (!u) {
    try {
      const registeredUsers = getRegisteredUsers();
      u = registeredUsers.find(x => x.username === username && x.password === password);
    } catch (e) {
      console.warn('Could not check registered users', e);
    }
  }
  
  if (u) {
    currentUser = username;
    try { saveSession(username); } catch (e) {}
    return true;
  }
  return false;
}

// User Registration Functions
const USERS_PROFILES_STORAGE_KEY = 'debp_user_profiles_v1';

export function getRegisteredUsers() {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn('Could not load registered users', e);
    return [];
  }
}

export function saveRegisteredUsers(usersList) {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(usersList));
    return true;
  } catch (e) {
    console.warn('Could not save registered users', e);
    return false;
  }
}

// Save complete user profile information
export function saveUserProfile(username, profileData) {
  try {
    const profiles = getUserProfiles();
    const existingIndex = profiles.findIndex(p => p.username === username);
    
    const userProfile = {
      ...profileData,
      username: username,
      updatedAt: new Date().toISOString()
    };

    if (existingIndex >= 0) {
      profiles[existingIndex] = userProfile;
    } else {
      userProfile.createdAt = new Date().toISOString();
      profiles.push(userProfile);
    }

    localStorage.setItem(USERS_PROFILES_STORAGE_KEY, JSON.stringify(profiles));
    return true;
  } catch (e) {
    console.warn('Could not save user profile', e);
    return false;
  }
}

// Get all user profiles
export function getUserProfiles() {
  try {
    const raw = localStorage.getItem(USERS_PROFILES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn('Could not load user profiles', e);
    return [];
  }
}

// Get specific user profile
export function getUserProfile(username) {
  try {
    const profiles = getUserProfiles();
    return profiles.find(p => p.username === username) || null;
  } catch (e) {
    console.warn('Could not get user profile', e);
    return null;
  }
}

// Update user profile field
export function updateUserProfile(username, fieldOrObject, value) {
  try {
    const profile = getUserProfile(username);
    if (profile) {
      // Handle both single field update and bulk update
      if (typeof fieldOrObject === 'object' && fieldOrObject !== null) {
        // Bulk update with object
        Object.assign(profile, fieldOrObject);
      } else {
        // Single field update
        profile[fieldOrObject] = value;
      }
      profile.updatedAt = new Date().toISOString();
      return saveUserProfile(username, profile);
    }
    return false;
  } catch (e) {
    console.warn('Could not update user profile', e);
    return false;
  }
}

// Delete user profile
export function deleteUserProfile(username) {
  try {
    const profiles = getUserProfiles();
    const filtered = profiles.filter(p => p.username !== username);
    localStorage.setItem(USERS_PROFILES_STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (e) {
    console.warn('Could not delete user profile', e);
    return false;
  }
}

export function registerUser(username, password, email, profileData = {}) {
  // Validate input
  if (!username || !password || !email) {
    return { success: false, message: 'All fields are required.' };
  }

  if (username.length < 3) {
    return { success: false, message: 'Username must be at least 3 characters long.' };
  }

  if (password.length < 6) {
    return { success: false, message: 'Password must be at least 6 characters long.' };
  }

  // Check if email is valid
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { success: false, message: 'Please enter a valid email address.' };
  }

  // Check if username already exists in built-in users
  let exists = Object.values(users).some(u => u.username.toLowerCase() === username.toLowerCase());
  if (exists) {
    return { success: false, message: 'Username already exists. Please choose another.' };
  }

  // Check if username or email already exists in registered users
  const registeredUsers = getRegisteredUsers();
  exists = registeredUsers.some(u => 
    u.username.toLowerCase() === username.toLowerCase() || u.email.toLowerCase() === email.toLowerCase()
  );
  if (exists) {
    return { success: false, message: 'Username or email already registered. Please use different credentials.' };
  }

  // Create new user
  const newUser = {
    id: Date.now(),
    username: username,
    password: password, // Note: In production, passwords should be hashed
    email: email,
    role: 'voter',
    createdAt: new Date().toISOString(),
    hasVoted: false
  };

  // Add to registered users
  registeredUsers.push(newUser);
  
  // Save to localStorage
  if (saveRegisteredUsers(registeredUsers)) {
    // Also save profile data if provided
    if (Object.keys(profileData).length > 0) {
      saveUserProfile(username, profileData);
    }
    return { success: true, message: 'Registration successful! You can now login.' };
  } else {
    return { success: false, message: 'Registration failed. Please try again.' };
  }
}

export function userExists(username) {
  const inBuiltUsers = Object.values(users).some(u => u.username.toLowerCase() === username.toLowerCase());
  if (inBuiltUsers) return true;
  
  const registeredUsers = getRegisteredUsers();
  return registeredUsers.some(u => u.username.toLowerCase() === username.toLowerCase());
}

export function getUserRole(username) {
  // Check built-in users
  const builtInUser = Object.values(users).find(u => u.username === username);
  if (builtInUser) return builtInUser.role;
  
  // Check registered users
  const registeredUsers = getRegisteredUsers();
  const registeredUser = registeredUsers.find(u => u.username === username);
  return registeredUser ? registeredUser.role : 'voter';
}

export function logout() {
  currentUser = null;
  try { localStorage.removeItem('debp_session_v1'); } catch (e) { }
}

export function isAdmin() {
  return currentUser === users.adminUser.username;
}
export function resetElectionData() {
  presCand.candA.votes = 0;
  presCand.candB.votes = 0;
  presCand.candC.votes = 0;
  totalVotes = 0;
  votingStatus = 'closed';
  votingHistory = [];
  // persist cleared state
  try { saveState(); } catch (e) { /* ignore */ }
}
export function castVote(candidateKey, voterName) {
  // Check if user has already voted
  const userHasVoted = votingHistory.some(vote => vote.voter === voterName);
  
  if (userHasVoted) {
    return { success: false, message: 'You have already voted. Each user can only vote once.' };
  }
  
  if (presCand.hasOwnProperty(candidateKey)) {
    presCand[candidateKey].votes += 1;
    totalVotes += 1;
    votingHistory.push({ voter: voterName, candidate: presCand[candidateKey].name.main, timestamp: new Date() });
    saveState();
    return { success: true, message: 'Vote cast successfully!' };
  }
  return { success: false, message: 'Invalid candidate. Please try again.' };
}

export function hasUserVoted(voterName) {
  return votingHistory.some(vote => vote.voter === voterName);
}
export function addCommunityPost(username, content) {
  const post = {
    id: communityPosts.length + 1,
    username: username,
    content: content,
    timestamp: new Date()
  };
  communityPosts.push(post);
}
export function addSupportMessage(username, message) {
  const supportMessage = {
    id: supportMessages.length + 1,
    username: username,
    message: message,
    timestamp: new Date()
  };
  supportMessages.push(supportMessage);
}

// ============================================
// VOTING SCHEDULE FUNCTIONS
// ============================================

/**
 * Save voting schedule to localStorage
 * @param {Object} schedule - Object with startDate, startTime, endDate, endTime
 */
export function saveVotingSchedule(schedule) {
  try {
    votingSchedule = {
      startDate: schedule.startDate || null,
      startTime: schedule.startTime || null,
      endDate: schedule.endDate || null,
      endTime: schedule.endTime || null
    };
    localStorage.setItem(VOTING_SCHEDULE_KEY, JSON.stringify(votingSchedule));
    console.log('✅ Voting schedule saved:', votingSchedule);
    return true;
  } catch (e) {
    console.error('❌ Failed to save voting schedule:', e);
    return false;
  }
}

/**
 * Load voting schedule from localStorage
 */
export function loadVotingSchedule() {
  try {
    const stored = localStorage.getItem(VOTING_SCHEDULE_KEY);
    if (stored) {
      votingSchedule = JSON.parse(stored);
      console.log('✅ Voting schedule loaded:', votingSchedule);
      return votingSchedule;
    }
  } catch (e) {
    console.error('❌ Failed to load voting schedule:', e);
  }
  return votingSchedule;
}

/**
 * Get voting schedule
 */
export function getVotingSchedule() {
  return votingSchedule;
}

/**
 * Clear voting schedule
 */
export function clearVotingSchedule() {
  try {
    votingSchedule = {
      startDate: null,
      startTime: null,
      endDate: null,
      endTime: null
    };
    localStorage.removeItem(VOTING_SCHEDULE_KEY);
    console.log('✅ Voting schedule cleared');
    return true;
  } catch (e) {
    console.error('❌ Failed to clear voting schedule:', e);
    return false;
  }
}

/**
 * Check if voting is currently active based on schedule
 */
export function isVotingTimeActive() {
  if (!votingSchedule.startDate || !votingSchedule.endDate) {
    return false;
  }

  const now = new Date();
  const startDateTime = new Date(`${votingSchedule.startDate}T${votingSchedule.startTime || '00:00'}`);
  const endDateTime = new Date(`${votingSchedule.endDate}T${votingSchedule.endTime || '23:59'}`);

  return now >= startDateTime && now <= endDateTime;
}

/**
 * Format voting schedule for display
 */
export function formatVotingSchedule() {
  const { startDate, startTime, endDate, endTime } = votingSchedule;

  if (!startDate || !endDate) {
    return 'No schedule set';
  }

  const startFormatted = `${startDate} at ${startTime || 'Start of Day'}`;
  const endFormatted = `${endDate} at ${endTime || 'End of Day'}`;

  return `Voting opens: ${startFormatted}\nVoting closes: ${endFormatted}`;
}

/**
 * Get voting access status with detailed information
 * Returns object with status, message, startTime, endTime
 */
export function getVotingAccessStatus() {
  const schedule = getVotingSchedule();
  const now = new Date();

  // If no schedule is set, voting is always open
  if (!schedule.startDate || !schedule.endDate) {
    return {
      isOpen: true,
      status: 'open',
      message: 'Voting is open',
      reason: 'No voting schedule is set'
    };
  }

  const startDateTime = new Date(`${schedule.startDate}T${schedule.startTime || '00:00'}`);
  const endDateTime = new Date(`${schedule.endDate}T${schedule.endTime || '23:59'}`);

  // Voting is active
  if (now >= startDateTime && now <= endDateTime) {
    return {
      isOpen: true,
      status: 'open',
      message: '✅ Voting is currently open',
      startDate: schedule.startDate,
      startTime: schedule.startTime,
      endDate: schedule.endDate,
      endTime: schedule.endTime,
      timeRemaining: endDateTime - now
    };
  }

  // Voting hasn't started yet
  if (now < startDateTime) {
    return {
      isOpen: false,
      status: 'not_started',
      message: '⏳ Voting has not started yet',
      startDate: schedule.startDate,
      startTime: schedule.startTime,
      endDate: schedule.endDate,
      endTime: schedule.endTime,
      timeUntilStart: startDateTime - now
    };
  }

  // Voting has ended
  return {
    isOpen: false,
    status: 'ended',
    message: '❌ Voting has ended',
    startDate: schedule.startDate,
    startTime: schedule.startTime,
    endDate: schedule.endDate,
    endTime: schedule.endTime
  };
}

// Candidate Management Functions
const CANDIDATES_STORAGE_KEY = 'debp_candidates_v1';

function saveCandidatesToStorage() {
  try {
    const candidateList = Object.entries(presCand).map(([key, data]) => ({
      key,
      ...data
    }));
    localStorage.setItem(CANDIDATES_STORAGE_KEY, JSON.stringify(candidateList));
  } catch (e) {
    console.warn('Could not save candidates', e);
  }
}

function loadCandidatesFromStorage() {
  try {
    const raw = localStorage.getItem(CANDIDATES_STORAGE_KEY);
    if (!raw) return;
    const candidateList = JSON.parse(raw);
    presCand = {};
    candidateList.forEach(cand => {
      const { key, ...data } = cand;
      presCand[key] = data;
    });
  } catch (e) {
    console.warn('Could not load candidates', e);
  }
}

export function getCandidates() {
  return Object.entries(presCand).map(([key, data]) => ({
    key,
    ...data
  }));
}

export function addCandidate(mainName, viceName, party) {
  // Validation
  if (!mainName || !viceName || !party) {
    return { success: false, message: 'All fields are required.' };
  }

  if (mainName.length < 3) {
    return { success: false, message: 'Candidate name must be at least 3 characters.' };
  }

  if (viceName.length < 3) {
    return { success: false, message: 'Running mate name must be at least 3 characters.' };
  }

  // Check if party already has a candidate
  const existingCandidate = getCandidates().find(c => c.party === party);
  if (existingCandidate) {
    return { success: false, message: `Party ${party} already has a candidate.` };
  }

  // Generate unique key
  const newKey = 'cand' + String.fromCharCode(65 + Object.keys(presCand).length);

  // Add candidate
  presCand[newKey] = {
    name: {
      main: mainName,
      vice: viceName
    },
    votes: 0,
    party: party
  };

  saveCandidatesToStorage();
  saveState();

  return { success: true, message: `Candidate ${mainName} added successfully.` };
}

export function updateCandidate(key, mainName, viceName, party) {
  // Validation
  if (!presCand.hasOwnProperty(key)) {
    return { success: false, message: 'Candidate not found.' };
  }

  if (!mainName || !viceName || !party) {
    return { success: false, message: 'All fields are required.' };
  }

  if (mainName.length < 3) {
    return { success: false, message: 'Candidate name must be at least 3 characters.' };
  }

  if (viceName.length < 3) {
    return { success: false, message: 'Running mate name must be at least 3 characters.' };
  }

  // Check if party is already taken by another candidate
  const existingCandidate = getCandidates().find(c => c.party === party && c.key !== key);
  if (existingCandidate) {
    return { success: false, message: `Party ${party} is already taken by another candidate.` };
  }

  // Update candidate
  presCand[key].name.main = mainName;
  presCand[key].name.vice = viceName;
  presCand[key].party = party;

  saveCandidatesToStorage();
  saveState();

  return { success: true, message: `Candidate ${mainName} updated successfully.` };
}

export function removeCandidate(key) {
  // Validation
  if (!presCand.hasOwnProperty(key)) {
    return { success: false, message: 'Candidate not found.' };
  }

  const candidateName = presCand[key].name.main;

  // Don't delete if candidate has votes (to preserve election integrity)
  if (presCand[key].votes > 0) {
    return { success: false, message: `Cannot delete ${candidateName} - candidate has received ${presCand[key].votes} votes.` };
  }

  // Delete candidate
  delete presCand[key];

  saveCandidatesToStorage();
  saveState();

  return { success: true, message: `Candidate ${candidateName} removed successfully.` };
}

export function resetCandidateVotes(key) {
  if (!presCand.hasOwnProperty(key)) {
    return { success: false, message: 'Candidate not found.' };
  }

  const candidateName = presCand[key].name.main;
  const votes = presCand[key].votes;

  presCand[key].votes = 0;
  totalVotes -= votes;

  saveCandidatesToStorage();
  saveState();

  return { success: true, message: `Votes reset for ${candidateName}.` };
}

// Load candidates from storage on module load
loadCandidatesFromStorage();

// ============================================
// KYC (Know Your Customer) Functions
// ============================================

export function setUserKYCStatus(username, status) {
  if (!['pending', 'verified', 'rejected'].includes(status)) {
    return { success: false, message: 'Invalid KYC status.' };
  }
  
  return updateUserProfile(username, 'kycStatus', status);
}

export function getUserKYCStatus(username) {
  const profile = getUserProfile(username);
  return profile ? (profile.kycStatus || 'pending') : null;
}

export function getAllUsersKYCStatus() {
  const profiles = getUserProfiles();
  return profiles.map(p => ({
    username: p.username,
    status: p.kycStatus || 'pending',
    verifiedAt: p.kycVerifiedAt || null,
    notes: p.kycNotes || ''
  }));
}

export function getKYCStatistics() {
  const profiles = getUserProfiles();
  const statuses = {
    total: profiles.length,
    verified: profiles.filter(p => p.kycStatus === 'verified').length,
    pending: profiles.filter(p => p.kycStatus === 'pending').length,
    rejected: profiles.filter(p => p.kycStatus === 'rejected').length
  };
  
  return {
    ...statuses,
    verificationRate: statuses.total > 0 ? ((statuses.verified / statuses.total) * 100).toFixed(2) : 0
  };
}

export function verifyUserKYC(username, notes = '') {
  const profile = getUserProfile(username);
  if (!profile) {
    return { success: false, message: 'User not found.' };
  }

  const result = updateUserProfile(username, 'kycStatus', 'verified');
  if (result) {
    updateUserProfile(username, 'kycVerifiedAt', new Date().toISOString());
    updateUserProfile(username, 'kycNotes', notes);
    return { success: true, message: `${username} has been verified.` };
  }
  
  return { success: false, message: 'Failed to verify user.' };
}

export function rejectUserKYC(username, reason = '', notes = '') {
  const profile = getUserProfile(username);
  if (!profile) {
    return { success: false, message: 'User not found.' };
  }

  const result = updateUserProfile(username, 'kycStatus', 'rejected');
  if (result) {
    updateUserProfile(username, 'kycVerifiedAt', new Date().toISOString());
    updateUserProfile(username, 'rejectionReason', reason);
    updateUserProfile(username, 'kycNotes', notes);
    return { success: true, message: `${username} has been rejected.` };
  }
  
  return { success: false, message: 'Failed to reject user.' };
}

export function exportUsersData() {
  const users = getRegisteredUsers();
  const profiles = getUserProfiles();
  
  const exportData = users.map(user => {
    const profile = profiles.find(p => p.username === user.username) || {};
    return {
      username: user.username,
      email: user.email,
      fullName: profile.fullname || 'N/A',
      phone: profile.phone || 'N/A',
      address: profile.address || 'N/A',
      city: profile.city || 'N/A',
      state: profile.state || 'N/A',
      nimcId: profile.nimc || 'N/A',
      age: profile.age || 'N/A',
      gender: profile.gender || 'N/A',
      kycStatus: profile.kycStatus || 'pending',
      kycVerifiedAt: profile.kycVerifiedAt || 'N/A',
      hasVoted: user.hasVoted || false,
      createdAt: user.createdAt
    };
  });
  
  return exportData;
}

export { saveState, loadState };
