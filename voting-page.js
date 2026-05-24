import { 
  getCandidates, 
  castVote, 
  hasUserVoted, 
  currentUser, 
  votingStatus,
  getVotingSchedule,
  loadVotingSchedule,
  isVotingTimeActive,
  getVotingAccessStatus
} from "../data/general-data.js";

document.addEventListener('DOMContentLoaded', () => {
  // Load voting schedule from storage first
  loadVotingSchedule();
  
  checkVotingAccess();
  initializeVotingPage();
  setupVotingInterface();
});

/**
 * Check if voting is available based on admin schedule
 */
function checkVotingAccess() {
  const schedule = getVotingSchedule();
  const votingAccessAlert = document.getElementById('voting-access-alert');
  const votingStatusContent = document.getElementById('voting-status-content');
  const votingContent = document.getElementById('voting-content');

  // If no schedule is set, allow voting
  if (!schedule.startDate || !schedule.endDate) {
    console.log('ℹ️ No voting schedule set - voting is open');
    if (votingAccessAlert) {
      votingAccessAlert.style.display = 'none';
    }
    return;
  }

  // Use isVotingTimeActive to check if voting is currently allowed
  const votingActive = isVotingTimeActive();
  const now = new Date();
  const startDateTime = new Date(`${schedule.startDate}T${schedule.startTime || '00:00'}`);
  const endDateTime = new Date(`${schedule.endDate}T${schedule.endTime || '23:59'}`);

  // Voting is active
  if (votingActive) {
    console.log('✅ Voting is OPEN - within scheduled time');
    if (votingAccessAlert) {
      votingAccessAlert.className = 'voting-access-alert open';
      votingAccessAlert.style.display = 'block';
      votingStatusContent.innerHTML = `
        <h3>✅ Voting is Open</h3>
        <p>Voting is currently active. Cast your vote now!</p>
        <p><strong>Voting ends:</strong> ${schedule.endDate} at ${schedule.endTime || 'End of Day'}</p>
      `;
    }
    if (votingContent) {
      votingContent.style.display = 'block';
    }
    return;
  }

  // Voting hasn't started yet
  if (now < startDateTime) {
    console.log('⏳ Voting has NOT started yet');
    if (votingAccessAlert) {
      votingAccessAlert.className = 'voting-access-alert closed';
      votingAccessAlert.style.display = 'block';
      votingStatusContent.innerHTML = `
        <h3>⏳ Voting Begins Soon</h3>
        <p>Voting is not yet open. Please return during the voting period.</p>
        <p><strong>Voting opens:</strong> ${schedule.startDate} at ${schedule.startTime || 'Start of Day'}</p>
        <div class="countdown" id="countdown"></div>
      `;
    }
    if (votingContent) {
      votingContent.style.display = 'none';
    }
    startCountdown(startDateTime);
    return;
  }

  // Voting has ended
  if (now > endDateTime) {
    console.log('❌ Voting has ENDED');
    if (votingAccessAlert) {
      votingAccessAlert.className = 'voting-access-alert closed';
      votingAccessAlert.style.display = 'block';
      votingStatusContent.innerHTML = `
        <h3>❌ Voting Has Ended</h3>
        <p>The voting period has concluded. Thank you for your participation.</p>
        <p><strong>Voting ended:</strong> ${schedule.endDate} at ${schedule.endTime || 'End of Day'}</p>
        <p><a href="results.html" class="btn btn-primary" style="display: inline-block; margin-top: 1rem;">View Results →</a></p>
      `;
    }
    if (votingContent) {
      votingContent.style.display = 'none';
    }
    return;
  }
}

/**
 * Countdown timer for when voting starts
 */
function startCountdown(startTime) {
  const countdownEl = document.getElementById('countdown');
  if (!countdownEl) return;

  function updateCountdown() {
    const now = new Date();
    const diff = startTime - now;

    if (diff <= 0) {
      countdownEl.innerHTML = '<p style="color: #27ae60; font-weight: 700;">🎉 Voting is now open! Please refresh the page.</p>';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    countdownEl.innerHTML = `<p>Voting starts in: <strong>${days}d ${hours}h ${minutes}m ${seconds}s</strong></p>`;
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
}

function initializeVotingPage() {
  // Check if voting is accessible based on schedule using isVotingTimeActive()
  const schedule = getVotingSchedule();
  
  let votingAllowed = true;
  
  // If schedule is set, use isVotingTimeActive to check if current time is within voting window
  if (schedule.startDate && schedule.endDate) {
    votingAllowed = isVotingTimeActive();
  }
  
  // If voting is not allowed, stop initialization
  if (!votingAllowed) {
    console.warn('❌ Voting is not currently available');
    return;
  }

  // Check if user is logged in
  if (!currentUser) {
    showMessage('Please log in to vote', 'warning');
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 2000);
    return;
  }

  // Load candidates
  loadCandidates();
  
  // Check voting status
  if (votingStatus === 'closed') {
    showMessage('Voting is currently closed', 'info');
  }

  // Check if user has already voted
  if (hasUserVoted(currentUser)) {
    showVotedMessage();
  }
}

function loadCandidates() {
  try {
    const candidates = getCandidates();
    // Target the correct voting options container
    const candidatesContainer = document.getElementById('votingOptions');
    
    if (!candidatesContainer) {
      console.error('Voting options container not found');
      return;
    }

    candidatesContainer.innerHTML = '';

    candidates.forEach(candidate => {
      const candidateCard = createCandidateCard(candidate);
      candidatesContainer.appendChild(candidateCard);
    });
  } catch (error) {
    console.error('Error loading candidates:', error);
    showMessage('Error loading candidates', 'error');
  }
}

function createCandidateCard(candidate) {
  const card = document.createElement('div');
  card.className = 'candidate-card';
  card.innerHTML = `
    <div class="candidate-header">
      <div class="candidate-avatar">👔</div>
    </div>
    <div class="candidate-info">
      <h3>${escapeHtml(candidate.name.main)}</h3>
      <p class="running-mate">Running Mate: ${escapeHtml(candidate.name.vice)}</p>
      <p class="party-name">Party: ${escapeHtml(candidate.party)}</p>
      <div class="vote-count">
        <span class="votes-badge">${candidate.votes} votes</span>
      </div>
    </div>
    <button class="vote-btn" data-candidate="${candidate.key}">Cast Vote</button>
  `;
  
  const voteBtn = card.querySelector('.vote-btn');
  voteBtn.addEventListener('click', () => handleVote(candidate.key, candidate.name.main));
  
  return card;
}

function handleVote(candidateKey, candidateName) {
  if (!currentUser) {
    showMessage('Please log in to vote', 'warning');
    return;
  }

  if (hasUserVoted(currentUser)) {
    showMessage('You have already voted. Each voter can only vote once.', 'warning');
    return;
  }

  // Confirm vote
  const confirmed = confirm(`Do you want to vote for ${candidateName}?\n\nThis action cannot be undone.`);
  
  if (!confirmed) return;

  try {
    const result = castVote(candidateKey, currentUser);
    
    if (result.success) {
      showMessage(`✓ Vote cast successfully for ${candidateName}!`, 'success');
      
      // Disable all vote buttons
      document.querySelectorAll('.vote-btn').forEach(btn => {
        btn.disabled = true;
        btn.textContent = 'Vote Cast';
      });

      // Show voted message
      setTimeout(() => {
        showVotedMessage();
      }, 1500);

      // Reload candidates to show updated vote count
      setTimeout(() => {
        loadCandidates();
      }, 1000);
    } else {
      showMessage(result.message || 'Error casting vote', 'error');
    }
  } catch (error) {
    console.error('Error casting vote:', error);
    showMessage('An error occurred while casting your vote', 'error');
  }
}

function showVotedMessage() {
  const container = document.getElementById('votingOptions');
  
  if (container) {
    container.innerHTML = `
      <div class="voted-message">
        <div class="success-icon">✓</div>
        <h2>Vote Successfully Cast</h2>
        <p>Thank you for participating in the democratic process!</p>
        <p class="voted-info">Your vote has been securely recorded and counted.</p>
        <div class="voted-actions">
          <a href="results.html" class="btn btn-primary">View Results</a>
          <a href="welcome-page.html" class="btn btn-secondary">Return Home</a>
        </div>
      </div>
    `;
  }
}

function setupVotingInterface() {
  // Setup hamburger menu
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });
  }

  // Close nav menu on link click
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu) navMenu.classList.remove('active');
    });
  });
}

function showMessage(message, type = 'info') {
  const messageContainer = document.getElementById('voting-message') ||
                          document.querySelector('.voting-message') ||
                          document.querySelector('.page-content');
  
  if (!messageContainer) return;

  const messageDiv = document.createElement('div');
  messageDiv.className = `alert alert-${type}`;
  messageDiv.textContent = message;
  messageDiv.style.cssText = `
    padding: 1rem;
    margin-bottom: 1.5rem;
    border-radius: 6px;
    font-weight: 500;
  `;

  if (type === 'success') {
    messageDiv.style.background = '#d4edda';
    messageDiv.style.color = '#155724';
    messageDiv.style.border = '1px solid #c3e6cb';
  } else if (type === 'error') {
    messageDiv.style.background = '#f8d7da';
    messageDiv.style.color = '#721c24';
    messageDiv.style.border = '1px solid #f5c6cb';
  } else if (type === 'warning') {
    messageDiv.style.background = '#fff3cd';
    messageDiv.style.color = '#856404';
    messageDiv.style.border = '1px solid #ffeeba';
  } else {
    messageDiv.style.background = '#d1ecf1';
    messageDiv.style.color = '#0c5460';
    messageDiv.style.border = '1px solid #bee5eb';
  }

  if (messageContainer.firstChild) {
    messageContainer.insertBefore(messageDiv, messageContainer.firstChild);
  } else {
    messageContainer.appendChild(messageDiv);
  }

  // Auto-remove success and info messages
  if (type === 'success' || type === 'info') {
    setTimeout(() => {
      messageDiv.remove();
    }, 5000);
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Export for use in other scripts
window.handleVote = handleVote;
window.loadCandidates = loadCandidates;
