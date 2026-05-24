import { presCand, castVote, currentUser, hasUserVoted } from "../data/general-data.js";

document.title = 'DEBP DEX';

document.addEventListener('DOMContentLoaded', () => {
  const optionsCol = document.querySelector('.options');
  const electionYear = document.querySelector('.election-year');
  const question = document.querySelector('.question');
  const submitBtn = document.querySelector('#submit-btn');
  const cancelBtn = document.querySelector('.js-cnc-btn');

  if (!optionsCol || !electionYear || !question || !submitBtn || !cancelBtn) {
    // Page doesn't have expected elements (e.g. results page). Bail quietly.
    return;
  }

  // Check if user has already voted
  if (currentUser && hasUserVoted(currentUser)) {
    question.innerHTML = `<h3 style="color: #e74c3c; font-weight: 700;">⚠️ You have already voted</h3>`;
    optionsCol.innerHTML = `<p style="text-align: center; color: #e74c3c; font-weight: 600;">Each voter can only cast one vote. You have already participated in this election.</p>`;
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.5';
    submitBtn.style.cursor = 'not-allowed';
    return;
  }

  question.innerHTML = `<h3>Who is your favorite candidate&quest; </h3>`;
  electionYear.innerHTML = `<h2>2027 Presidential Election</h2>`;
  optionsCol.innerHTML = `
    <p>Who do you choose to be your president from 2027 &dash; 2031&quest;</p>
    <label class="candidate-a">
      <input type="radio" name="vote" value="A"> ${presCand.candA.name.main} &middot; ${presCand.candA.name.vice} &dash; ${presCand.candA.party}
    </label>
    <label class="candidate-b">
      <input type="radio" name="vote" value="B"> ${presCand.candB.name.main} &middot; ${presCand.candB.name.vice} &dash; ${presCand.candB.party}
    </label>
    <label class="candidate-c">
      <input type="radio" name="vote" value="C"> ${presCand.candC.name.main} &middot; ${presCand.candC.name.vice} &dash; ${presCand.candC.party}
    </label>
  `;

  submitBtn.textContent = 'Submit Vote';
  cancelBtn.textContent = 'Back to Home';

  submitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const selectedRadio = document.querySelector('input[name="vote"]:checked');
    if (!selectedRadio) {
      alert('Please select a candidate to vote for');
      return;
    }

    const map = { A: 'candA', B: 'candB', C: 'candC' };
    const key = map[selectedRadio.value];
    const voterName = currentUser || 'anonymous';
    const result = castVote(key, voterName);
    
    if (result.success) {
      alert(`Thank you for voting for ${selectedRadio.value.toUpperCase()}!`);
      setTimeout(() => {
        window.location.href = 'results.html';
      }, 300);
    } else {
      alert(result.message || 'There was an error casting your vote.');
    }
  });

  cancelBtn.addEventListener('click', function cancel() {
    window.location.href = 'welcome-page.html';
  });
});
