import { supportMessages, addSupportMessage, currentUser } from "../data/general-data.js";

document.title = 'Help & Support - DEBP';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('support-form');
  const msgInput = document.getElementById('support-message');
  const messagesContainer = document.getElementById('support-messages');

  function renderMessages() {
    if (!messagesContainer) return;
    if (!Array.isArray(supportMessages) || supportMessages.length === 0) {
      messagesContainer.innerHTML = '<p>No support messages yet.</p>';
      return;
    }
    const html = supportMessages.slice().reverse().map(msg => {
      const t = new Date(msg.timestamp).toLocaleString();
      return `
        <div class="support-message">
          <strong>${msg.username}</strong> <small>${t}</small>
          <p>${msg.message}</p>
        </div>
      `;
    }).join('\n');
    messagesContainer.innerHTML = html;
  }

  renderMessages();

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = msgInput.value.trim();
      if (!text) {
        alert('Please enter a message.');
        return;
      }
      const user = currentUser || 'anonymous';
      addSupportMessage(user, text);
      msgInput.value = '';
      renderMessages();
      alert('Your message has been submitted. Thank you!');
    });
  }
});
