import { 
  isAdmin, 
  currentUser, 
  getCandidates, 
  addCandidate, 
  updateCandidate, 
  removeCandidate, 
  resetCandidateVotes 
} from "../data/general-data.js";

document.title = 'Manage Candidates - DEBP';

let editingKey = null;

document.addEventListener('DOMContentLoaded', () => {
  // Check if user is admin
  if (!isAdmin()) {
    window.location.href = 'welcome-page.html';
    return;
  }

  const form = document.getElementById('candidate-form');
  const mainNameInput = document.getElementById('main-name');
  const viceNameInput = document.getElementById('vice-name');
  const partyInput = document.getElementById('party');
  const formMessage = document.getElementById('form-message');
  const submitBtn = document.getElementById('submit-btn');
  const cancelBtn = document.getElementById('cancel-btn');
  const candidateKeyInput = document.getElementById('candidate-key');

  // Load and display candidates
  loadAndDisplayCandidates();

  // Form submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    formMessage.style.display = 'none';

    const mainName = mainNameInput.value.trim();
    const viceName = viceNameInput.value.trim();
    const party = partyInput.value.trim();

    let result;

    if (editingKey) {
      // Update existing candidate
      result = updateCandidate(editingKey, mainName, viceName, party);
    } else {
      // Add new candidate
      result = addCandidate(mainName, viceName, party);
    }

    if (result.success) {
      formMessage.className = 'form-message success-message';
      formMessage.textContent = result.message;
      formMessage.style.display = 'block';

      // Reset form
      form.reset();
      editingKey = null;
      candidateKeyInput.value = '';
      submitBtn.textContent = 'Add Candidate';
      cancelBtn.style.display = 'none';

      // Reload candidates
      setTimeout(() => {
        loadAndDisplayCandidates();
      }, 500);
    } else {
      formMessage.className = 'form-message error-message';
      formMessage.textContent = result.message;
      formMessage.style.display = 'block';
    }
  });

  // Cancel edit button
  cancelBtn.addEventListener('click', () => {
    form.reset();
    editingKey = null;
    candidateKeyInput.value = '';
    submitBtn.textContent = 'Add Candidate';
    cancelBtn.style.display = 'none';
    formMessage.style.display = 'none';
  });
});

function loadAndDisplayCandidates() {
  const candidatesList = getCandidates();
  const table = document.getElementById('candidates-table');
  const countEl = document.getElementById('candidates-count');

  countEl.textContent = `Total candidates: ${candidatesList.length}`;

  if (candidatesList.length === 0) {
    table.innerHTML = '<p class="empty-message">No candidates added yet. Add one using the form above.</p>';
    return;
  }

  table.innerHTML = candidatesList.map(cand => `
    <div class="candidate-card">
      <div class="candidate-header">
        <h4>${cand.name.main}</h4>
        <span class="party-badge">${cand.party}</span>
      </div>
      <div class="candidate-info">
        <p><strong>Running Mate:</strong> ${cand.name.vice}</p>
        <p><strong>Votes Received:</strong> <span class="vote-count">${cand.votes}</span></p>
      </div>
      <div class="candidate-actions">
        <button class="edit-btn" onclick="editCandidate('${cand.key}')">✏️ Edit</button>
        <button class="reset-btn" onclick="resetVotes('${cand.key}')">🔄 Reset Votes</button>
        <button class="delete-btn" onclick="deleteCandidate('${cand.key}')">🗑️ Remove</button>
      </div>
    </div>
  `).join('');
}

window.editCandidate = function(key) {
  const candidatesList = getCandidates();
  const candidate = candidatesList.find(c => c.key === key);
  
  if (!candidate) return;

  const mainNameInput = document.getElementById('main-name');
  const viceNameInput = document.getElementById('vice-name');
  const partyInput = document.getElementById('party');
  const candidateKeyInput = document.getElementById('candidate-key');
  const submitBtn = document.getElementById('submit-btn');
  const cancelBtn = document.getElementById('cancel-btn');

  mainNameInput.value = candidate.name.main;
  viceNameInput.value = candidate.name.vice;
  partyInput.value = candidate.party;
  candidateKeyInput.value = key;
  submitBtn.textContent = 'Update Candidate';
  cancelBtn.style.display = 'inline-block';

  // Scroll to form
  document.getElementById('candidate-form').scrollIntoView({ behavior: 'smooth' });
};

window.deleteCandidate = function(key) {
  const candidatesList = getCandidates();
  const candidate = candidatesList.find(c => c.key === key);

  if (!candidate) return;

  const confirmed = confirm(`Are you sure you want to remove "${candidate.name.main}"?`);
  if (!confirmed) return;

  const result = removeCandidate(key);
  const formMessage = document.getElementById('form-message');

  if (result.success) {
    formMessage.className = 'form-message success-message';
    formMessage.textContent = result.message;
    formMessage.style.display = 'block';
    loadAndDisplayCandidates();
  } else {
    formMessage.className = 'form-message error-message';
    formMessage.textContent = result.message;
    formMessage.style.display = 'block';
  }
};

window.resetVotes = function(key) {
  const candidatesList = getCandidates();
  const candidate = candidatesList.find(c => c.key === key);

  if (!candidate) return;

  const confirmed = confirm(`Reset votes for "${candidate.name.main}" (Currently: ${candidate.votes} votes)?`);
  if (!confirmed) return;

  const result = resetCandidateVotes(key);
  const formMessage = document.getElementById('form-message');

  if (result.success) {
    formMessage.className = 'form-message success-message';
    formMessage.textContent = result.message;
    formMessage.style.display = 'block';
    loadAndDisplayCandidates();
  } else {
    formMessage.className = 'form-message error-message';
    formMessage.textContent = result.message;
    formMessage.style.display = 'block';
  }
};
