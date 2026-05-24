import { presCand, totalVotes } from "../data/general-data.js";
document.title = "Election Results";
document.addEventListener('DOMContentLoaded', () => {
  const resultsCol = document.querySelector('.results-col');
  if (!resultsCol) return;

  const a = presCand.candA.votes || 0;
  const b = presCand.candB.votes || 0;
  const c = presCand.candC.votes || 0;
  const total = a + b + c || 0;

  function pct(count) {
    return total === 0 ? '0%' : Math.round((count / total) * 100) + '%';
  }

  // Create result items with progress bars
  const resultHTML = `
    <div class="result-item">
      <h3>${presCand.candA.name.main}</h3>
      <p><strong>${a} votes</strong> (${pct(a)})</p>
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${pct(a)}; background: linear-gradient(90deg, #667eea, #764ba2);"></div>
      </div>
    </div>
    <div class="result-item">
      <h3>${presCand.candB.name.main}</h3>
      <p><strong>${b} votes</strong> (${pct(b)})</p>
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${pct(b)}; background: linear-gradient(90deg, #667eea, #764ba2);"></div>
      </div>
    </div>
    <div class="result-item">
      <h3>${presCand.candC.name.main}</h3>
      <p><strong>${c} votes</strong> (${pct(c)})</p>
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${pct(c)}; background: linear-gradient(90deg, #667eea, #764ba2);"></div>
      </div>
    </div>
  `;

  resultsCol.innerHTML = resultHTML;

  // Add summary section
  const summaryDiv = document.createElement('div');
  summaryDiv.style.cssText = 'margin-top: 2rem; padding: 1.5rem; background: linear-gradient(135deg, #f8f9ff 0%, #f0f2f5 100%); border-radius: 12px; border-left: 5px solid #667eea;';
  summaryDiv.innerHTML = `
    <h3 style="margin-top: 0; color: #667eea;">📊 Vote Summary</h3>
    <p style="margin: 0.5rem 0;"><strong>Total Votes Cast:</strong> <span style="font-size: 1.3rem; color: #667eea; font-weight: 700;">${total}</span></p>
    <p style="margin: 0.5rem 0;"><strong>Election Status:</strong> <span style="color: #27ae60; font-weight: 600;">✓ Results Updated</span></p>
  `;
  resultsCol.appendChild(summaryDiv);
});
