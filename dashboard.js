import { presCand, votingHistory, resetElectionData, loadState, saveState } from "../data/general-data.js";

document.title = 'Dashboard - DEBP';

let chartInstances = {};

// Sample demographic and expense data
const demographicData = {
  gender: { male: 520, female: 480 },
  education: { primary: 150, secondary: 300, tertiary: 550 },
  region: { north: 350, south: 400, east: 250 }
};

const campaignExpenses = {
  candA: { advertising: 50000, rallies: 30000, media: 20000, administration: 15000 },
  candB: { advertising: 45000, rallies: 35000, media: 25000, administration: 18000 },
  candC: { advertising: 40000, rallies: 28000, media: 18000, administration: 12000 }
};

const ageGroupData = {
  '18-25': 120,
  '26-35': 280,
  '36-45': 350,
  '46-55': 180,
  '56-65': 70
};

const turnoutTimeline = [
  { time: '6:00 AM', votes: 50 },
  { time: '9:00 AM', votes: 230 },
  { time: '12:00 PM', votes: 450 },
  { time: '3:00 PM', votes: 670 },
  { time: '6:00 PM', votes: 900 },
  { time: '9:00 PM', votes: 1000 }
];

document.addEventListener('DOMContentLoaded', () => {
  loadState();

  const aCount = presCand.candA.votes || 0;
  const bCount = presCand.candB.votes || 0;
  const cCount = presCand.candC.votes || 0;
  const total = aCount + bCount + cCount;
  const registeredVoters = 1000;
  const turnoutPercent = registeredVoters === 0 ? 0 : Math.round((total / registeredVoters) * 100);

  // Update metrics
  updateMetrics(total, turnoutPercent, registeredVoters, 3);

  // Initialize all charts
  initializeCharts(aCount, bCount, cCount, total);

  // Update candidates section
  updateCandidatesSection(aCount, bCount, cCount, total);

  // Update voting history
  updateVotingHistory();

  // Setup event listeners
  setupEventListeners();
});

function updateMetrics(total, turnoutPercent, registeredVoters, candidates) {
  const totalVotesEl = document.getElementById('total-votes');
  const turnoutEl = document.getElementById('turnout-percent');
  const registeredEl = document.getElementById('registered-voters');
  const candidatesEl = document.getElementById('active-candidates');

  if (totalVotesEl) totalVotesEl.textContent = total.toLocaleString();
  if (turnoutEl) turnoutEl.textContent = turnoutPercent + '%';
  if (registeredEl) registeredEl.textContent = registeredVoters.toLocaleString();
  if (candidatesEl) candidatesEl.textContent = candidates;
}

function initializeCharts(aCount, bCount, cCount, total) {
  // Election Results Pie Chart
  if (document.getElementById('electionResultsChart')) {
    createElectionResultsChart(aCount, bCount, cCount);
  }

  // Vote Distribution Bar Chart
  if (document.getElementById('voteDistributionChart')) {
    createVoteDistributionChart(aCount, bCount, cCount);
  }

  // Turnout Over Time Line Chart
  if (document.getElementById('turnoutChart')) {
    createTurnoutChart();
  }

  // Demographic Doughnut Chart
  if (document.getElementById('demographicChart')) {
    createDemographicChart();
  }

  // Campaign Expenses Stacked Bar Chart
  if (document.getElementById('expensesChart')) {
    createExpensesChart();
  }

  // Age Group Radar Chart
  if (document.getElementById('ageGroupChart')) {
    createAgeGroupChart();
  }
}

function createElectionResultsChart(aCount, bCount, cCount) {
  const ctx = document.getElementById('electionResultsChart').getContext('2d');
  
  if (chartInstances.electionResults) {
    chartInstances.electionResults.destroy();
  }

  chartInstances.electionResults = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: [
        presCand.candA.name.main,
        presCand.candB.name.main,
        presCand.candC.name.main
      ],
      datasets: [{
        data: [aCount, bCount, cCount],
        backgroundColor: [
          'rgba(255, 107, 107, 0.8)',
          'rgba(66, 133, 244, 0.8)',
          'rgba(251, 188, 5, 0.8)'
        ],
        borderColor: [
          'rgba(255, 107, 107, 1)',
          'rgba(66, 133, 244, 1)',
          'rgba(251, 188, 5, 1)'
        ],
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'bottom'
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const value = context.parsed;
              const percentage = total === 0 ? '0%' : Math.round((value / total) * 100) + '%';
              return context.label + ': ' + value + ' votes (' + percentage + ')';
            }
          }
        }
      }
    }
  });
}

function createVoteDistributionChart(aCount, bCount, cCount) {
  const ctx = document.getElementById('voteDistributionChart').getContext('2d');
  
  if (chartInstances.voteDistribution) {
    chartInstances.voteDistribution.destroy();
  }

  chartInstances.voteDistribution = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: [
        presCand.candA.name.main,
        presCand.candB.name.main,
        presCand.candC.name.main
      ],
      datasets: [{
        label: 'Votes Received',
        data: [aCount, bCount, cCount],
        backgroundColor: [
          'rgba(255, 107, 107, 0.8)',
          'rgba(66, 133, 244, 0.8)',
          'rgba(251, 188, 5, 0.8)'
        ],
        borderColor: [
          'rgba(255, 107, 107, 1)',
          'rgba(66, 133, 244, 1)',
          'rgba(251, 188, 5, 1)'
        ],
        borderWidth: 2
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: true
        }
      },
      scales: {
        x: {
          beginAtZero: true
        }
      }
    }
  });
}

function createTurnoutChart() {
  const ctx = document.getElementById('turnoutChart').getContext('2d');
  
  if (chartInstances.turnout) {
    chartInstances.turnout.destroy();
  }

  chartInstances.turnout = new Chart(ctx, {
    type: 'line',
    data: {
      labels: turnoutTimeline.map(d => d.time),
      datasets: [{
        label: 'Cumulative Votes Cast',
        data: turnoutTimeline.map(d => d.votes),
        borderColor: 'rgba(102, 126, 234, 1)',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 6,
        pointBackgroundColor: 'rgba(102, 126, 234, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: true
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

function createDemographicChart() {
  const ctx = document.getElementById('demographicChart').getContext('2d');
  
  if (chartInstances.demographic) {
    chartInstances.demographic.destroy();
  }

  chartInstances.demographic = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: Object.keys(demographicData.gender).map(g => g.charAt(0).toUpperCase() + g.slice(1)),
      datasets: [{
        label: 'Gender Distribution',
        data: Object.values(demographicData.gender),
        backgroundColor: [
          'rgba(100, 150, 255, 0.8)',
          'rgba(255, 150, 150, 0.8)'
        ],
        borderColor: [
          'rgba(100, 150, 255, 1)',
          'rgba(255, 150, 150, 1)'
        ],
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  });
}

function createExpensesChart() {
  const ctx = document.getElementById('expensesChart').getContext('2d');
  
  if (chartInstances.expenses) {
    chartInstances.expenses.destroy();
  }

  const expenseCategories = ['advertising', 'rallies', 'media', 'administration'];
  const candAExpenses = expenseCategories.map(cat => campaignExpenses.candA[cat]);
  const candBExpenses = expenseCategories.map(cat => campaignExpenses.candB[cat]);
  const candCExpenses = expenseCategories.map(cat => campaignExpenses.candC[cat]);

  chartInstances.expenses = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: expenseCategories.map(c => c.charAt(0).toUpperCase() + c.slice(1)),
      datasets: [
        {
          label: presCand.candA.name.main,
          data: candAExpenses,
          backgroundColor: 'rgba(255, 107, 107, 0.8)',
          borderColor: 'rgba(255, 107, 107, 1)',
          borderWidth: 1
        },
        {
          label: presCand.candB.name.main,
          data: candBExpenses,
          backgroundColor: 'rgba(66, 133, 244, 0.8)',
          borderColor: 'rgba(66, 133, 244, 1)',
          borderWidth: 1
        },
        {
          label: presCand.candC.name.main,
          data: candCExpenses,
          backgroundColor: 'rgba(251, 188, 5, 0.8)',
          borderColor: 'rgba(251, 188, 5, 1)',
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: true
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return '₦' + value.toLocaleString();
            }
          }
        }
      }
    }
  });
}

function createAgeGroupChart() {
  const ctx = document.getElementById('ageGroupChart').getContext('2d');
  
  if (chartInstances.ageGroup) {
    chartInstances.ageGroup.destroy();
  }

  chartInstances.ageGroup = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: Object.keys(ageGroupData),
      datasets: [{
        label: 'Voters by Age Group',
        data: Object.values(ageGroupData),
        borderColor: 'rgba(102, 126, 234, 1)',
        backgroundColor: 'rgba(102, 126, 234, 0.2)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(102, 126, 234, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: true
        }
      },
      scales: {
        r: {
          beginAtZero: true
        }
      }
    }
  });
}

function updateCandidatesSection(aCount, bCount, cCount, total) {
  const candContainer = document.getElementById('candidates-list');
  
  if (!candContainer) return;

  function pct(n) { 
    return total === 0 ? '0%' : Math.round((n/total)*100) + '%'; 
  }

  const candidatesHTML = `
    <div class="result-item">
      <h3>${presCand.candA.name.main}</h3>
      <p>Running mate: ${presCand.candA.name.vice}</p>
      <p>Party: <strong>${presCand.candA.party}</strong></p>
      <p><strong>${aCount} votes</strong> (${pct(aCount)})</p>
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${pct(aCount)}; background: linear-gradient(90deg, #667eea, #764ba2);"></div>
      </div>
    </div>
    <div class="result-item">
      <h3>${presCand.candB.name.main}</h3>
      <p>Running mate: ${presCand.candB.name.vice}</p>
      <p>Party: <strong>${presCand.candB.party}</strong></p>
      <p><strong>${bCount} votes</strong> (${pct(bCount)})</p>
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${pct(bCount)}; background: linear-gradient(90deg, #667eea, #764ba2);"></div>
      </div>
    </div>
    <div class="result-item">
      <h3>${presCand.candC.name.main}</h3>
      <p>Running mate: ${presCand.candC.name.vice}</p>
      <p>Party: <strong>${presCand.candC.party}</strong></p>
      <p><strong>${cCount} votes</strong> (${pct(cCount)})</p>
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${pct(cCount)}; background: linear-gradient(90deg, #667eea, #764ba2);"></div>
      </div>
    </div>
  `;

  candContainer.innerHTML = candidatesHTML;

  // Add summary section
  const summaryDiv = document.createElement('div');
  summaryDiv.style.cssText = 'grid-column: 1 / -1; margin-top: 1rem; padding: 1.5rem; background: linear-gradient(135deg, #f8f9ff 0%, #f0f2f5 100%); border-radius: 12px; border-left: 5px solid #667eea;';
  summaryDiv.innerHTML = `
    <h4 style="margin-top: 0; color: #667eea; font-size: 1.1rem;">📊 Candidate Vote Summary</h4>
    <p style="margin: 0.5rem 0;"><strong>Total Votes Cast:</strong> <span style="font-size: 1.2rem; color: #667eea; font-weight: 700;">${total}</span></p>
    <p style="margin: 0;"><strong>Leading Candidate:</strong> <span style="color: #27ae60; font-weight: 600;">${aCount > bCount && aCount > cCount ? presCand.candA.name.main : bCount > cCount ? presCand.candB.name.main : presCand.candC.name.main}</span></p>
  `;
  candContainer.appendChild(summaryDiv);
}

function updateVotingHistory() {
  const historyEl = document.getElementById('voting-history');
  
  if (!historyEl) return;

  if (!Array.isArray(votingHistory) || votingHistory.length === 0) {
    historyEl.innerHTML = '<p>No votes cast yet.</p>';
  } else {
    const items = votingHistory.slice().reverse().slice(0, 10).map(h => {
      const t = new Date(h.timestamp).toLocaleString();
      return `<li><span class="time">${t}</span> — <span class="voter">${h.voter || 'anonymous'}</span> voted for <span class="candidate">${h.candidate}</span></li>`;
    }).join('\n');
    historyEl.innerHTML = `<ul class="history-list">${items}</ul>`;
  }
}

function setupEventListeners() {
  const resetBtn = document.getElementById('reset-election');
  const exportBtn = document.getElementById('export-report');

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      const ok = confirm('Reset election data? This will clear all votes and charts.');
      if (!ok) return;
      resetElectionData();
      try { saveState(); } catch (e) { /* ignore */ }
      window.location.reload();
    });
  }

  if (exportBtn) {
    exportBtn.addEventListener('click', exportReport);
  }
}

function exportReport() {
  const aCount = presCand.candA.votes || 0;
  const bCount = presCand.candB.votes || 0;
  const cCount = presCand.candC.votes || 0;
  const total = aCount + bCount + cCount;
  const registeredVoters = 1000;
  const turnoutPercent = registeredVoters === 0 ? 0 : Math.round((total / registeredVoters) * 100);

  const report = `
ELECTION DASHBOARD REPORT
Generated: ${new Date().toLocaleString()}
=====================================

KEY METRICS:
- Total Votes Cast: ${total}
- Voter Turnout: ${turnoutPercent}%
- Registered Voters: ${registeredVoters}
- Active Candidates: 3

CANDIDATE RESULTS:
1. ${presCand.candA.name.main} (${presCand.candA.party})
   Votes: ${aCount} (${total === 0 ? '0%' : Math.round((aCount/total)*100)}%)

2. ${presCand.candB.name.main} (${presCand.candB.party})
   Votes: ${bCount} (${total === 0 ? '0%' : Math.round((bCount/total)*100)}%)

3. ${presCand.candC.name.main} (${presCand.candC.party})
   Votes: ${cCount} (${total === 0 ? '0%' : Math.round((cCount/total)*100)}%)

DEMOGRAPHIC DATA:
Gender Distribution: Male ${demographicData.gender.male}, Female ${demographicData.gender.female}
Education Levels: Primary ${demographicData.education.primary}, Secondary ${demographicData.education.secondary}, Tertiary ${demographicData.education.tertiary}

CAMPAIGN EXPENSES:
Candidate A: ${JSON.stringify(campaignExpenses.candA, null, 2)}
Candidate B: ${JSON.stringify(campaignExpenses.candB, null, 2)}
Candidate C: ${JSON.stringify(campaignExpenses.candC, null, 2)}

RECENT VOTING ACTIVITY:
${votingHistory.slice().reverse().slice(0, 10).map(h => `${new Date(h.timestamp).toLocaleString()} - ${h.voter || 'anonymous'} voted for ${h.candidate}`).join('\n')}
  `;

  const blob = new Blob([report], { type: 'text/plain' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `election-report-${new Date().getTime()}.txt`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

