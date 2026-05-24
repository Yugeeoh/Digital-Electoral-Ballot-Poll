import { getRegisteredUsers, getUserProfiles, updateUserProfile, getUserProfile } from "../data/general-data.js";

let currentFilter = 'all';
let currentSearchTerm = '';
let allUsers = [];

document.addEventListener('DOMContentLoaded', () => {
  loadAndDisplayUsers();
  setupEventListeners();
});

function setupEventListeners() {
  // Search functionality
  const searchInput = document.getElementById('search-users');
  searchInput.addEventListener('input', (e) => {
    currentSearchTerm = e.target.value.toLowerCase();
    filterAndDisplayUsers();
  });

  // Filter buttons
  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      filterAndDisplayUsers();
    });
  });

  // Modal buttons
  document.getElementById('close-modal').addEventListener('click', closeModal);
  document.getElementById('close-modal-btn').addEventListener('click', closeModal);
  document.getElementById('modal-overlay').addEventListener('click', closeModal);

  document.getElementById('approve-btn').addEventListener('click', approveUser);
  document.getElementById('reject-btn').addEventListener('click', rejectUser);
}

function loadAndDisplayUsers() {
  try {
    const registeredUsers = getRegisteredUsers();
    const profiles = getUserProfiles();

    allUsers = registeredUsers.map(user => {
      const profile = profiles.find(p => p.username === user.username);
      return {
        ...user,
        profile: profile || {},
        kycStatus: profile?.kycStatus || 'pending',
        kycVerifiedAt: profile?.kycVerifiedAt || null
      };
    });

    updateStatistics();
    filterAndDisplayUsers();
  } catch (error) {
    console.error('Error loading users:', error);
  }
}

function updateStatistics() {
  const total = allUsers.length;
  const verified = allUsers.filter(u => u.kycStatus === 'verified').length;
  const pending = allUsers.filter(u => u.kycStatus === 'pending').length;
  const rejected = allUsers.filter(u => u.kycStatus === 'rejected').length;

  document.getElementById('total-users').textContent = total;
  document.getElementById('verified-users').textContent = verified;
  document.getElementById('pending-users').textContent = pending;
  document.getElementById('rejected-users').textContent = rejected;
}

function filterAndDisplayUsers() {
  let filteredUsers = allUsers;

  // Apply filter
  if (currentFilter !== 'all') {
    filteredUsers = filteredUsers.filter(u => u.kycStatus === currentFilter);
  }

  // Apply search
  if (currentSearchTerm) {
    filteredUsers = filteredUsers.filter(u => {
      const username = u.username.toLowerCase();
      const email = u.email.toLowerCase();
      const fullname = (u.profile.fullname || '').toLowerCase();
      const nimc = (u.profile.nimc || '').toLowerCase();
      
      return username.includes(currentSearchTerm) || 
             email.includes(currentSearchTerm) || 
             fullname.includes(currentSearchTerm) || 
             nimc.includes(currentSearchTerm);
    });
  }

  displayUsersInTable(filteredUsers);
}

function displayUsersInTable(users) {
  const tbody = document.getElementById('users-table-body');
  
  if (users.length === 0) {
    tbody.innerHTML = '<tr class="empty-state"><td colspan="8">No users found</td></tr>';
    return;
  }

  tbody.innerHTML = users.map(user => {
    const statusClass = `status-${user.kycStatus}`;
    const statusText = user.kycStatus.charAt(0).toUpperCase() + user.kycStatus.slice(1);
    const joinedDate = new Date(user.createdAt).toLocaleDateString();
    
    return `
      <tr class="user-row" data-username="${user.username}">
        <td class="username-cell"><strong>${escapeHtml(user.username)}</strong></td>
        <td>${escapeHtml(user.profile.fullname || 'N/A')}</td>
        <td>${escapeHtml(user.email)}</td>
        <td>${escapeHtml(user.profile.phone || 'N/A')}</td>
        <td>${escapeHtml(user.profile.nimc || 'N/A')}</td>
        <td><span class="status-badge ${statusClass}">${statusText}</span></td>
        <td>${joinedDate}</td>
        <td>
          <button class="action-btn view-btn" onclick="viewUserDetails('${escapeAttr(user.username)}')">View</button>
        </td>
      </tr>
    `;
  }).join('');
}

function viewUserDetails(username) {
  const user = allUsers.find(u => u.username === username);
  if (!user) return;

  const profile = user.profile;
  const createdDate = new Date(user.createdAt).toLocaleDateString();
  const verifiedDate = user.kycVerifiedAt ? new Date(user.kycVerifiedAt).toLocaleDateString() : 'N/A';

  const detailsHtml = `
    <div class="user-details-content">
      <div class="details-section">
        <h3>Account Information</h3>
        <div class="detail-row">
          <label>Username:</label>
          <span>${escapeHtml(user.username)}</span>
        </div>
        <div class="detail-row">
          <label>Email:</label>
          <span>${escapeHtml(user.email)}</span>
        </div>
        <div class="detail-row">
          <label>Password:</label>
          <span class="password-display" id="password-display">
            <code>${escapeHtml(user.password)}</code>
            <button class="password-toggle-btn" onclick="togglePasswordVisibility()">👁️ Show</button>
          </span>
        </div>
        <div class="detail-row">
          <label>Account Created:</label>
          <span>${createdDate}</span>
        </div>
        <div class="detail-row">
          <label>Has Voted:</label>
          <span>${user.hasVoted ? '✓ Yes' : '✗ No'}</span>
        </div>
      </div>

      <div class="details-section">
        <h3>Personal Information</h3>
        <div class="detail-row">
          <label>Full Name:</label>
          <span>${escapeHtml(profile.fullname || 'N/A')}</span>
        </div>
        <div class="detail-row">
          <label>Age:</label>
          <span>${profile.age || 'N/A'}</span>
        </div>
        <div class="detail-row">
          <label>Gender:</label>
          <span>${escapeHtml(profile.gender || 'N/A')}</span>
        </div>
      </div>

      <div class="details-section">
        <h3>Contact Information</h3>
        <div class="detail-row">
          <label>Phone:</label>
          <span>${escapeHtml(profile.phone || 'N/A')}</span>
        </div>
        <div class="detail-row">
          <label>Address:</label>
          <span>${escapeHtml(profile.address || 'N/A')}</span>
        </div>
        <div class="detail-row">
          <label>City:</label>
          <span>${escapeHtml(profile.city || 'N/A')}</span>
        </div>
        <div class="detail-row">
          <label>State:</label>
          <span>${escapeHtml(profile.state || 'N/A')}</span>
        </div>
      </div>

      <div class="details-section">
        <h3>Identity Verification</h3>
        <div class="detail-row">
          <label>NIMC ID:</label>
          <span>${escapeHtml(profile.nimc || 'N/A')}</span>
        </div>
        <div class="detail-row">
          <label>KYC Status:</label>
          <span class="status-badge status-${user.kycStatus}">
            ${user.kycStatus.charAt(0).toUpperCase() + user.kycStatus.slice(1)}
          </span>
        </div>
        <div class="detail-row">
          <label>KYC Verified Date:</label>
          <span>${verifiedDate}</span>
        </div>
      </div>

      <div class="details-section">
        <h3>Verification Notes</h3>
        <textarea id="kyc-notes" class="kyc-notes-input" placeholder="Add notes for this user's KYC verification..." rows="4">${profile.kycNotes || ''}</textarea>
      </div>
    </div>
  `;

  document.getElementById('modal-body').innerHTML = detailsHtml;
  document.getElementById('approve-btn').dataset.username = username;
  document.getElementById('reject-btn').dataset.username = username;
  
  openModal();
}

function approveUser() {
  const username = this.dataset.username;
  if (!username) return;

  const profile = getUserProfile(username);
  if (profile) {
    profile.kycStatus = 'verified';
    profile.kycVerifiedAt = new Date().toISOString();
    profile.kycNotes = document.getElementById('kyc-notes')?.value || '';
    
    if (updateUserProfile(username, 'kycStatus', 'verified')) {
      updateUserProfile(username, 'kycVerifiedAt', new Date().toISOString());
      updateUserProfile(username, 'kycNotes', profile.kycNotes);
      
      loadAndDisplayUsers();
      closeModal();
      showNotification('User approved successfully!', 'success');
    }
  }
}

function rejectUser() {
  const username = this.dataset.username;
  if (!username) return;

  const reason = prompt('Enter rejection reason:');
  if (reason === null) return;

  const profile = getUserProfile(username);
  if (profile) {
    profile.kycStatus = 'rejected';
    profile.kycVerifiedAt = new Date().toISOString();
    profile.rejectionReason = reason;
    profile.kycNotes = document.getElementById('kyc-notes')?.value || '';
    
    if (updateUserProfile(username, 'kycStatus', 'rejected')) {
      updateUserProfile(username, 'kycVerifiedAt', new Date().toISOString());
      updateUserProfile(username, 'rejectionReason', reason);
      updateUserProfile(username, 'kycNotes', profile.kycNotes);
      
      loadAndDisplayUsers();
      closeModal();
      showNotification('User rejected successfully!', 'info');
    }
  }
}

function openModal() {
  document.getElementById('user-details-modal').style.display = 'flex';
  document.getElementById('modal-overlay').style.display = 'block';
}

function closeModal() {
  document.getElementById('user-details-modal').style.display = 'none';
  document.getElementById('modal-overlay').style.display = 'none';
}

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function escapeAttr(text) {
  return text.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function togglePasswordVisibility() {
  const codeEl = document.querySelector('.password-display code');
  const btn = document.querySelector('.password-toggle-btn');
  
  if (codeEl.style.opacity === '0' || codeEl.style.opacity === '') {
    codeEl.style.opacity = '1';
    codeEl.style.filter = 'none';
    btn.textContent = '🙈 Hide';
  } else {
    codeEl.style.opacity = '0.3';
    codeEl.style.filter = 'blur(5px)';
    btn.textContent = '👁️ Show';
  }
}

// Make functions globally accessible
window.viewUserDetails = viewUserDetails;
window.togglePasswordVisibility = togglePasswordVisibility;
