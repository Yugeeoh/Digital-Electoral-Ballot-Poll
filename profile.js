import { 
  currentUser, 
  users,
  getUserProfile,
  updateUserProfile 
} from "../data/general-data.js";

document.title = 'User Profile - DEBP';

// Voter ID Generator
function generateVoterId() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  
  let voterId = 'DEBP-';
  
  // Generate 3 random letters
  for (let i = 0; i < 3; i++) {
    voterId += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  
  voterId += '-';
  
  // Generate 6 random numbers
  for (let i = 0; i < 6; i++) {
    voterId += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }
  
  return voterId;
}

// Get or create voter ID for current user
function getOrCreateVoterId() {
  const storageKey = `voter_id_${currentUser}`;
  let voterId = localStorage.getItem(storageKey);
  
  if (!voterId) {
    voterId = generateVoterId();
    localStorage.setItem(storageKey, voterId);
  }
  
  return voterId;
}

document.addEventListener('DOMContentLoaded', () => {
  const profileError = document.getElementById('profile-error');
  const profileSuccess = document.getElementById('profile-success');

  // Check if user is logged in
  if (!currentUser) {
    profileError.textContent = '❌ You must be logged in to view your profile.';
    profileError.style.display = 'block';
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 2000);
    return;
  }

  // Load user data from storage using general-data.js
  const userProfile = getUserProfile(currentUser) || {};

  // Get voter ID
  const voterId = getOrCreateVoterId();

  // Populate profile header
  document.getElementById('profile-fullname').textContent = userProfile.fullname || currentUser;
  document.getElementById('profile-username').textContent = `@${currentUser}`;
  document.getElementById('profile-nimc').textContent = userProfile.nimc || '-';

  // Populate voter ID display
  document.getElementById('voter-id-display').textContent = voterId;

  // Populate personal information
  document.getElementById('info-fullname').textContent = userProfile.fullname || '-';
  document.getElementById('info-email').textContent = userProfile.email || '-';
  document.getElementById('info-phone').textContent = userProfile.phone || '-';
  document.getElementById('info-age').textContent = userProfile.age || '-';
  document.getElementById('info-gender').textContent = userProfile.gender || '-';
  document.getElementById('info-dob').textContent = userProfile.dob || '-';

  // Populate address information
  document.getElementById('info-address').textContent = userProfile.address || '-';
  document.getElementById('info-city').textContent = userProfile.city || '-';
  document.getElementById('info-state').textContent = userProfile.state || '-';
  document.getElementById('info-postal').textContent = userProfile.postal || '-';

  // Populate account information
  document.getElementById('info-username').textContent = currentUser;
  document.getElementById('info-account-status').textContent = 'Active';
  
  // Get member since date
  const memberSinceKey = `user_joined_${currentUser}`;
  let joinedDate = localStorage.getItem(memberSinceKey);
  if (!joinedDate) {
    joinedDate = new Date().toLocaleDateString();
    localStorage.setItem(memberSinceKey, joinedDate);
  }
  document.getElementById('info-joined-date').textContent = joinedDate;

  // Count votes cast (from voting history)
  const votingHistoryKey = 'debp_voting_history';
  const votingHistory = JSON.parse(localStorage.getItem(votingHistoryKey) || '[]');
  const userVoteCount = votingHistory.filter(vote => vote.voter === currentUser).length;
  document.getElementById('info-votes-cast').textContent = userVoteCount;

  // Regenerate Voter ID button
  const regenerateBtn = document.getElementById('regenerate-voter-id');
  if (regenerateBtn) {
    regenerateBtn.addEventListener('click', () => {
      const confirmed = confirm('Are you sure you want to generate a new Voter ID? Your old ID will be replaced.');
      if (confirmed) {
        const newVoterId = generateVoterId();
        const storageKey = `voter_id_${currentUser}`;
        localStorage.setItem(storageKey, newVoterId);
        document.getElementById('voter-id-display').textContent = newVoterId;
        
        profileSuccess.textContent = '✅ Voter ID regenerated successfully!';
        profileSuccess.style.display = 'block';
        setTimeout(() => {
          profileSuccess.style.display = 'none';
        }, 3000);
      }
    });
  }

  // Navigation highlighting (from welcome.js)
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-menu a');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Mobile menu toggle
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      hamburger.classList.toggle('active');
    });

    // Close mobile menu when a link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
      });
    });
  }

  // ===== EDIT PROFILE FUNCTIONALITY =====
  const editProfileBtn = document.getElementById('edit-profile-btn');
  const editProfileModal = document.getElementById('edit-profile-modal');
  const editProfileOverlay = document.getElementById('edit-profile-overlay');
  const closeEditModalBtn = document.getElementById('close-edit-modal');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const editProfileForm = document.getElementById('edit-profile-form');
  const editProfileError = document.getElementById('edit-profile-error');
  const editProfileSuccess = document.getElementById('edit-profile-success');

  function openEditModal() {
    loadProfileDataIntoForm();
    editProfileModal.style.display = 'block';
    editProfileOverlay.style.display = 'block';
    document.body.style.overflow = 'hidden';
  }

  function closeEditModal() {
    editProfileModal.style.display = 'none';
    editProfileOverlay.style.display = 'none';
    document.body.style.overflow = 'auto';
    editProfileError.style.display = 'none';
    editProfileSuccess.style.display = 'none';
  }

  function loadProfileDataIntoForm() {
    const profile = getUserProfile(currentUser);
    if (profile) {
      document.getElementById('edit-fullname').value = profile.fullname || '';
      document.getElementById('edit-email').value = profile.email || '';
      document.getElementById('edit-phone').value = profile.phone || '';
      document.getElementById('edit-age').value = profile.age || '';
      document.getElementById('edit-gender').value = profile.gender || '';
      document.getElementById('edit-nimc').value = profile.nimc || '';
      document.getElementById('edit-address').value = profile.address || '';
      document.getElementById('edit-city').value = profile.city || '';
      document.getElementById('edit-state').value = profile.state || '';
    }
  }

  function validateProfileForm() {
    const fullname = document.getElementById('edit-fullname').value.trim();
    const email = document.getElementById('edit-email').value.trim();
    const phone = document.getElementById('edit-phone').value.trim();
    const age = document.getElementById('edit-age').value;
    const gender = document.getElementById('edit-gender').value;
    const nimc = document.getElementById('edit-nimc').value.trim();
    const address = document.getElementById('edit-address').value.trim();
    const city = document.getElementById('edit-city').value.trim();
    const state = document.getElementById('edit-state').value.trim();

    // Validation checks
    if (!fullname) {
      showEditError('Full name is required');
      return false;
    }
    if (fullname.length < 2) {
      showEditError('Full name must be at least 2 characters');
      return false;
    }

    if (!email) {
      showEditError('Email is required');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showEditError('Please enter a valid email address');
      return false;
    }

    if (!phone) {
      showEditError('Phone number is required');
      return false;
    }
    if (phone.length < 10) {
      showEditError('Phone number must be at least 10 digits');
      return false;
    }

    if (!age) {
      showEditError('Age is required');
      return false;
    }
    if (age < 18) {
      showEditError('You must be at least 18 years old');
      return false;
    }

    if (!gender) {
      showEditError('Gender is required');
      return false;
    }

    if (!nimc) {
      showEditError('NIMC ID is required');
      return false;
    }
    if (nimc.length < 8) {
      showEditError('NIMC ID must be at least 8 characters');
      return false;
    }

    if (!address) {
      showEditError('Street address is required');
      return false;
    }

    if (!city) {
      showEditError('City is required');
      return false;
    }

    if (!state) {
      showEditError('State is required');
      return false;
    }

    return true;
  }

  function showEditError(message) {
    editProfileError.textContent = message;
    editProfileError.style.display = 'block';
    editProfileSuccess.style.display = 'none';
  }

  function showEditSuccess(message) {
    editProfileSuccess.textContent = message;
    editProfileSuccess.style.display = 'block';
    editProfileError.style.display = 'none';
  }

  function refreshProfileDisplay() {
    // Reload profile data from storage
    const updatedProfile = getUserProfile(currentUser) || {};

    // Update profile header (top section with avatar)
    document.getElementById('profile-fullname').textContent = updatedProfile.fullname || currentUser;
    document.getElementById('profile-username').textContent = `@${currentUser}`;
    document.getElementById('profile-nimc').textContent = updatedProfile.nimc || '-';

    // Update personal information section
    document.getElementById('info-fullname').textContent = updatedProfile.fullname || '-';
    document.getElementById('info-email').textContent = updatedProfile.email || '-';
    document.getElementById('info-phone').textContent = updatedProfile.phone || '-';
    document.getElementById('info-age').textContent = updatedProfile.age || '-';
    document.getElementById('info-gender').textContent = updatedProfile.gender || '-';

    // Update address information section
    document.getElementById('info-address').textContent = updatedProfile.address || '-';
    document.getElementById('info-city').textContent = updatedProfile.city || '-';
    document.getElementById('info-state').textContent = updatedProfile.state || '-';

    // Log the update for debugging
    console.log('✅ Profile display refreshed with updated data:', {
      fullname: updatedProfile.fullname,
      email: updatedProfile.email,
      phone: updatedProfile.phone,
      age: updatedProfile.age,
      gender: updatedProfile.gender,
      nimc: updatedProfile.nimc,
      address: updatedProfile.address,
      city: updatedProfile.city,
      state: updatedProfile.state
    });
  }

  function handleProfileUpdate(e) {
    e.preventDefault();

    if (!validateProfileForm()) {
      return;
    }

    const updatedProfile = {
      fullname: document.getElementById('edit-fullname').value.trim(),
      email: document.getElementById('edit-email').value.trim(),
      phone: document.getElementById('edit-phone').value.trim(),
      age: parseInt(document.getElementById('edit-age').value),
      gender: document.getElementById('edit-gender').value,
      nimc: document.getElementById('edit-nimc').value.trim(),
      address: document.getElementById('edit-address').value.trim(),
      city: document.getElementById('edit-city').value.trim(),
      state: document.getElementById('edit-state').value.trim()
    };

    try {
      // Save profile data to general-data.js (which saves to localStorage)
      const saveResult = updateUserProfile(currentUser, updatedProfile);
      
      if (saveResult) {
        // Verify data was saved
        const savedProfile = getUserProfile(currentUser);
        console.log('✅ Profile saved successfully:', savedProfile);
        console.log('✅ Updated fields:', updatedProfile);
        
        showEditSuccess('✅ Profile updated successfully!');
        
        // Refresh profile display with new data immediately
        refreshProfileDisplay();
        
        // Additional verification: check all fields were updated
        console.log('✅ Profile display refreshed. Current display values:');
        console.log('  - Full Name:', document.getElementById('info-fullname').textContent);
        console.log('  - Email:', document.getElementById('info-email').textContent);
        console.log('  - Phone:', document.getElementById('info-phone').textContent);
        console.log('  - Age:', document.getElementById('info-age').textContent);
        console.log('  - Gender:', document.getElementById('info-gender').textContent);
        console.log('  - NIMC:', document.getElementById('profile-nimc').textContent);
        console.log('  - Address:', document.getElementById('info-address').textContent);
        console.log('  - City:', document.getElementById('info-city').textContent);
        console.log('  - State:', document.getElementById('info-state').textContent);
        
        // Close modal after brief delay
        setTimeout(() => {
          closeEditModal();
        }, 1500);
      } else {
        showEditError('Failed to save profile data. Please try again.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      showEditError('Failed to update profile: ' + error.message);
    }
  }

  // Edit profile event listeners
  if (editProfileBtn) {
    editProfileBtn.addEventListener('click', openEditModal);
  }
  if (closeEditModalBtn) {
    closeEditModalBtn.addEventListener('click', closeEditModal);
  }
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeEditModal);
  }
  if (editProfileOverlay) {
    editProfileOverlay.addEventListener('click', closeEditModal);
  }
  if (editProfileForm) {
    editProfileForm.addEventListener('submit', handleProfileUpdate);
  }

  // Close modal with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && editProfileModal && editProfileModal.style.display === 'block') {
      closeEditModal();
    }
  });
});
