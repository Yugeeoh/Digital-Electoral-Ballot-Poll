import { getCandidates } from '../data/general-data.js';

let currentFilter = 'all';

document.addEventListener('DOMContentLoaded', function() {
  loadCandidates();
  initializeFilterButtons();
});

function initializeFilterButtons() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      // Remove active class from all buttons
      filterButtons.forEach(b => b.classList.remove('active'));
      // Add active class to clicked button
      this.classList.add('active');
      // Update filter and reload
      currentFilter = this.dataset.filter;
      loadCandidates();
    });
  });
}

function loadCandidates() {
  const candidates = getCandidates();
  const container = document.getElementById('candidatesContainer');
  
  if (!container) {
    console.error('Candidates container not found');
    return;
  }

  // Filter candidates based on selected party
  let filteredCandidates = candidates;
  if (currentFilter !== 'all') {
    filteredCandidates = candidates.filter(c => c.party === currentFilter);
  }

  container.innerHTML = '';

  if (filteredCandidates.length === 0) {
    container.innerHTML = '<p class="no-candidates">No candidates found</p>';
    return;
  }

  filteredCandidates.forEach(candidate => {
    const candidateCard = createCandidateCard(candidate);
    container.appendChild(candidateCard);
  });
}

function createCandidateCard(candidate) {
  const card = document.createElement('div');
  card.className = 'candidate-card';
  card.innerHTML = `
    <div class="candidate-header">
      <img src="${candidate.partyLogo}" alt="${candidate.party}" class="party-logo">
      <span class="party-badge">${candidate.party}</span>
    </div>
    
    <div class="candidate-ticket">
      <!-- Presidential Candidate -->
      <div class="ticket-member presidential">
        <div class="member-image">
          <img src="${candidate.photo}" alt="${candidate.name.main}" class="candidate-photo">
        </div>
        <div class="member-info">
          <h3 class="member-title">Presidential Candidate</h3>
          <h2 class="member-name">${candidate.name.main}</h2>
          <p class="member-bio">${candidate.mainBio}</p>
          <div class="member-memoir">
            <h4>Memoir</h4>
            <p>${candidate.mainMemoir}</p>
          </div>
        </div>
      </div>

      <!-- Vice Presidential Candidate -->
      <div class="ticket-member vice-presidential">
        <div class="member-image">
          <img src="${candidate.vicePhoto}" alt="${candidate.name.vice}" class="candidate-photo">
        </div>
        <div class="member-info">
          <h3 class="member-title">Vice Presidential Candidate</h3>
          <h2 class="member-name">${candidate.name.vice}</h2>
          <p class="member-bio">${candidate.viceBio}</p>
          <div class="member-memoir">
            <h4>Memoir</h4>
            <p>${candidate.viceMemoir}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="candidate-actions">
      <a href="voting-page.html" class="btn btn-primary btn-vote"><img src="images/debp-02.svg" style="transform:translateY(5px);width:30px;"> Vote for ${candidate.party}</a>
    </div>
  `;

  return card;
}
