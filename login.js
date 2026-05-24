import { login, getUserRole } from "../data/general-data.js";

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('login-form');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const errorEl = document.getElementById('login-error');
  const successEl = document.getElementById('login-success');

  if (!form) return;

  // Add focus styles for better UX
  usernameInput.addEventListener('focus', () => {
    errorEl.style.display = 'none';
  });

  passwordInput.addEventListener('focus', () => {
    errorEl.style.display = 'none';
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Clear previous messages
    errorEl.style.display = 'none';
    successEl.style.display = 'none';

    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    // Validate inputs
    if (!username || !password) {
      errorEl.textContent = 'Please enter both username and password.';
      errorEl.style.display = 'block';
      return;
    }

    // Attempt login
    const ok = login(username, password);

    if (ok) {
      successEl.textContent = `Welcome, ${username}! Redirecting...`;
      successEl.style.display = 'block';

      // Determine redirect based on user role
      const userRole = getUserRole(username);
      
      setTimeout(() => {
        if (userRole === 'admin') {
          window.location.href = 'dashboard.html';
        } else {
          window.location.href = 'voting-page.html';
        }
      }, 1000);
    } else {
      errorEl.textContent = 'Invalid username or password. Please try again.';
      errorEl.style.display = 'block';
      
      // Clear password field for security
      passwordInput.value = '';
    }
  });
});
