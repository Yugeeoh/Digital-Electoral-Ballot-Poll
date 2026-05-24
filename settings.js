import { 
  votingStatus, 
  resetElectionData, 
  isAdmin, 
  logout,
  currentUser,
  getUserProfile,
  updateUserProfile,
  saveVotingSchedule,
  loadVotingSchedule,
  getVotingSchedule,
  clearVotingSchedule,
  formatVotingSchedule
} from "../data/general-data.js";

document.title = 'Settings - DEBP';

document.addEventListener('DOMContentLoaded', () => {
  const statusEl = document.getElementById('voting-status');
  const toggleBtn = document.getElementById('toggle-voting');
  const resetBtn = document.getElementById('reset-btn');
  const logoutBtn = document.getElementById('logout-btn');
  const editProfileBtnSettings = document.getElementById('edit-profile-btn-settings');
  const editProfileModalSettings = document.getElementById('edit-profile-modal-settings');
  const editProfileOverlaySettings = document.getElementById('edit-profile-overlay-settings');
  const closeEditModalBtnSettings = document.getElementById('close-edit-modal-settings');
  const closeModalBtnSettings = document.getElementById('close-modal-btn-settings');
  const editProfileFormSettings = document.getElementById('edit-profile-form-settings');
  const editProfileErrorSettings = document.getElementById('edit-profile-error-settings');
  const editProfileSuccessSettings = document.getElementById('edit-profile-success-settings');

  function updateStatus() {
    if (statusEl) {
      statusEl.textContent = votingStatus === 'open' ? 'OPEN' : 'CLOSED';
      statusEl.style.color = votingStatus === 'open' ? 'green' : 'red';
    }
  }

  updateStatus();

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      if (!isAdmin()) {
        alert('Only admins can toggle voting status.');
        return;
      }
      // Toggle voting status (for demo; would need to export to data module for persistence)
      alert('Toggle voting status feature (admin only).');
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (!isAdmin()) {
        alert('Only admins can reset election data.');
        return;
      }
      const ok = confirm('Reset all election data? This cannot be undone.');
      if (!ok) return;
      resetElectionData();
      alert('Election data reset.');
      window.location.reload();
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      const ok = confirm('Log out?');
      if (!ok) return;
      logout();
      window.location.href = 'welcome-page.html';
    });
  }

  // Admin-only access control for candidate management link
  const adminLink = document.getElementById('admin-link');
  if (adminLink) {
    if (!isAdmin()) {
      adminLink.style.display = 'none';
    } else {
      adminLink.addEventListener('click', (e) => {
        // Admin user can access the page
        window.location.href = 'admin-candidates.html';
        e.preventDefault();
      });
    }
  }

  // ===== EDIT PROFILE FUNCTIONALITY =====
  function openEditModalSettings() {
    loadProfileDataIntoFormSettings();
    editProfileModalSettings.style.display = 'block';
    editProfileOverlaySettings.style.display = 'block';
    document.body.style.overflow = 'hidden';
  }

  function closeEditModalSettings() {
    editProfileModalSettings.style.display = 'none';
    editProfileOverlaySettings.style.display = 'none';
    document.body.style.overflow = 'auto';
    editProfileErrorSettings.style.display = 'none';
    editProfileSuccessSettings.style.display = 'none';
  }

  function loadProfileDataIntoFormSettings() {
    if (!currentUser) return;
    
    const profile = getUserProfile(currentUser);
    if (profile) {
      document.getElementById('edit-fullname-settings').value = profile.fullname || '';
      document.getElementById('edit-email-settings').value = profile.email || '';
      document.getElementById('edit-phone-settings').value = profile.phone || '';
      document.getElementById('edit-age-settings').value = profile.age || '';
      document.getElementById('edit-gender-settings').value = profile.gender || '';
      document.getElementById('edit-nimc-settings').value = profile.nimc || '';
      document.getElementById('edit-address-settings').value = profile.address || '';
      document.getElementById('edit-city-settings').value = profile.city || '';
      document.getElementById('edit-state-settings').value = profile.state || '';
    }
  }

  function validateProfileFormSettings() {
    const fullname = document.getElementById('edit-fullname-settings').value.trim();
    const email = document.getElementById('edit-email-settings').value.trim();
    const phone = document.getElementById('edit-phone-settings').value.trim();
    const age = document.getElementById('edit-age-settings').value;
    const gender = document.getElementById('edit-gender-settings').value;
    const nimc = document.getElementById('edit-nimc-settings').value.trim();
    const address = document.getElementById('edit-address-settings').value.trim();
    const city = document.getElementById('edit-city-settings').value.trim();
    const state = document.getElementById('edit-state-settings').value.trim();

    if (!fullname) {
      showEditErrorSettings('Full name is required');
      return false;
    }
    if (fullname.length < 2) {
      showEditErrorSettings('Full name must be at least 2 characters');
      return false;
    }

    if (!email) {
      showEditErrorSettings('Email is required');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showEditErrorSettings('Please enter a valid email address');
      return false;
    }

    if (!phone) {
      showEditErrorSettings('Phone number is required');
      return false;
    }
    if (phone.length < 10) {
      showEditErrorSettings('Phone number must be at least 10 digits');
      return false;
    }

    if (!age) {
      showEditErrorSettings('Age is required');
      return false;
    }
    if (age < 18) {
      showEditErrorSettings('You must be at least 18 years old');
      return false;
    }

    if (!gender) {
      showEditErrorSettings('Gender is required');
      return false;
    }

    if (!nimc) {
      showEditErrorSettings('NIMC ID is required');
      return false;
    }
    if (nimc.length < 8) {
      showEditErrorSettings('NIMC ID must be at least 8 characters');
      return false;
    }

    if (!address) {
      showEditErrorSettings('Street address is required');
      return false;
    }

    if (!city) {
      showEditErrorSettings('City is required');
      return false;
    }

    if (!state) {
      showEditErrorSettings('State is required');
      return false;
    }

    return true;
  }

  function showEditErrorSettings(message) {
    editProfileErrorSettings.textContent = message;
    editProfileErrorSettings.style.display = 'block';
    editProfileSuccessSettings.style.display = 'none';
  }

  function showEditSuccessSettings(message) {
    editProfileSuccessSettings.textContent = message;
    editProfileSuccessSettings.style.display = 'block';
    editProfileErrorSettings.style.display = 'none';
  }

  function handleProfileUpdateSettings(e) {
    e.preventDefault();

    if (!validateProfileFormSettings()) {
      return;
    }

    if (!currentUser) {
      showEditErrorSettings('User not logged in');
      return;
    }

    const updatedProfile = {
      fullname: document.getElementById('edit-fullname-settings').value.trim(),
      email: document.getElementById('edit-email-settings').value.trim(),
      phone: document.getElementById('edit-phone-settings').value.trim(),
      age: parseInt(document.getElementById('edit-age-settings').value),
      gender: document.getElementById('edit-gender-settings').value,
      nimc: document.getElementById('edit-nimc-settings').value.trim(),
      address: document.getElementById('edit-address-settings').value.trim(),
      city: document.getElementById('edit-city-settings').value.trim(),
      state: document.getElementById('edit-state-settings').value.trim()
    };

    try {
      // Save profile data to general-data.js (which saves to localStorage)
      const saveResult = updateUserProfile(currentUser, updatedProfile);
      
      if (saveResult) {
        // Verify data was saved
        const savedProfile = getUserProfile(currentUser);
        console.log('✅ Profile saved successfully:', savedProfile);
        console.log('✅ Updated fields:', updatedProfile);
        
        showEditSuccessSettings('✅ Profile updated successfully!');
        
        // Close modal after brief delay
        setTimeout(() => {
          closeEditModalSettings();
        }, 1500);
      } else {
        showEditErrorSettings('Failed to save profile data. Please try again.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      showEditErrorSettings('Failed to update profile: ' + error.message);
    }
  }

  // Edit profile event listeners
  if (editProfileBtnSettings) {
    editProfileBtnSettings.addEventListener('click', openEditModalSettings);
  }
  if (closeEditModalBtnSettings) {
    closeEditModalBtnSettings.addEventListener('click', closeEditModalSettings);
  }
  if (closeModalBtnSettings) {
    closeModalBtnSettings.addEventListener('click', closeEditModalSettings);
  }
  if (editProfileOverlaySettings) {
    editProfileOverlaySettings.addEventListener('click', closeEditModalSettings);
  }
  if (editProfileFormSettings) {
    editProfileFormSettings.addEventListener('submit', handleProfileUpdateSettings);
  }

  // ============================================
  // VOTING SCHEDULE HANDLERS
  // ============================================
  
  const votingStartDateInput = document.getElementById('voting-start-date');
  const votingStartTimeInput = document.getElementById('voting-start-time');
  const votingEndDateInput = document.getElementById('voting-end-date');
  const votingEndTimeInput = document.getElementById('voting-end-time');
  const saveScheduleBtn = document.getElementById('save-voting-schedule');
  const clearScheduleBtn = document.getElementById('clear-voting-schedule');
  const scheduleInfoDiv = document.getElementById('schedule-info');
  const scheduleDisplayP = document.getElementById('current-schedule-display');

  // Load existing schedule on page load
  function loadScheduleUI() {
    const schedule = getVotingSchedule();
    if (schedule.startDate) {
      votingStartDateInput.value = schedule.startDate;
      votingStartTimeInput.value = schedule.startTime || '00:00';
      votingEndDateInput.value = schedule.endDate;
      votingEndTimeInput.value = schedule.endTime || '23:59';
      
      // Show current schedule info
      if (scheduleInfoDiv && scheduleDisplayP) {
        scheduleInfoDiv.style.display = 'block';
        scheduleDisplayP.innerHTML = `
          <strong>Start:</strong> ${schedule.startDate} at ${schedule.startTime || 'Start of Day'}<br>
          <strong>End:</strong> ${schedule.endDate} at ${schedule.endTime || 'End of Day'}
        `;
      }
    }
  }

  loadScheduleUI();

  // Save voting schedule
  if (saveScheduleBtn) {
    saveScheduleBtn.addEventListener('click', () => {
      if (!isAdmin()) {
        alert('Only admins can set voting schedule.');
        return;
      }

      const startDate = votingStartDateInput.value;
      const startTime = votingStartTimeInput.value;
      const endDate = votingEndDateInput.value;
      const endTime = votingEndTimeInput.value;

      // Validation
      if (!startDate || !endDate) {
        alert('Please enter both start and end dates.');
        return;
      }

      // Validate that end date is after start date
      const startDateTime = new Date(`${startDate}T${startTime || '00:00'}`);
      const endDateTime = new Date(`${endDate}T${endTime || '23:59'}`);

      if (endDateTime <= startDateTime) {
        alert('End date/time must be after start date/time.');
        return;
      }

      const schedule = {
        startDate,
        startTime: startTime || '00:00',
        endDate,
        endTime: endTime || '23:59'
      };

      if (saveVotingSchedule(schedule)) {
        alert('✅ Voting schedule saved successfully!');
        if (scheduleInfoDiv && scheduleDisplayP) {
          scheduleInfoDiv.style.display = 'block';
          scheduleDisplayP.innerHTML = `
            <strong>Start:</strong> ${startDate} at ${startTime || 'Start of Day'}<br>
            <strong>End:</strong> ${endDate} at ${endTime || 'End of Day'}
          `;
        }
      } else {
        alert('❌ Failed to save voting schedule.');
      }
    });
  }

  // Clear voting schedule
  if (clearScheduleBtn) {
    clearScheduleBtn.addEventListener('click', () => {
      if (!isAdmin()) {
        alert('Only admins can clear voting schedule.');
        return;
      }

      if (confirm('Are you sure you want to clear the voting schedule?')) {
        if (clearVotingSchedule()) {
          alert('✅ Voting schedule cleared.');
          votingStartDateInput.value = '';
          votingStartTimeInput.value = '';
          votingEndDateInput.value = '';
          votingEndTimeInput.value = '';
          if (scheduleInfoDiv) {
            scheduleInfoDiv.style.display = 'none';
          }
        } else {
          alert('❌ Failed to clear voting schedule.');
        }
      }
    });
  }

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && editProfileModalSettings && editProfileModalSettings.style.display === 'block') {
        closeEditModalSettings();
      }
    });
  });
