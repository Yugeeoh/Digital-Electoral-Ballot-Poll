import { getUserRole } from "../data/general-data.js";

document.addEventListener('DOMContentLoaded', () => {
  const forgotPasswordForm = document.getElementById('forgot-password-form');
  const resetPasswordForm = document.getElementById('reset-password-form');
  
  const step1Container = document.getElementById('step1-container');
  const step2Container = document.getElementById('step2-container');
  const step3Container = document.getElementById('step3-container');
  
  const recoveryUsername = document.getElementById('recovery-username');
  const recoveryError = document.getElementById('recovery-error');
  const recoverySuccess = document.getElementById('recovery-success');
  
  const newPasswordInput = document.getElementById('new-password');
  const confirmPasswordInput = document.getElementById('confirm-password');
  const resetError = document.getElementById('reset-error');
  const resetSuccess = document.getElementById('reset-success');

  let recoveredUsername = '';

  // Step 1: Username verification
  if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener('submit', (e) => {
      e.preventDefault();

      recoveryError.style.display = 'none';
      recoverySuccess.style.display = 'none';

      const username = recoveryUsername.value.trim();

      if (!username) {
        recoveryError.textContent = 'Please enter your username.';
        recoveryError.style.display = 'block';
        return;
      }

      // Check if user exists
      try {
        const userRole = getUserRole(username);
        if (userRole) {
          recoveredUsername = username;
          recoverySuccess.textContent = `Username verified! Proceed to reset your password.`;
          recoverySuccess.style.display = 'block';

          setTimeout(() => {
            step1Container.style.display = 'none';
            step2Container.style.display = 'block';
            newPasswordInput.focus();
          }, 800);
        } else {
          recoveryError.textContent = 'Username not found. Please check and try again.';
          recoveryError.style.display = 'block';
        }
      } catch (error) {
        recoveryError.textContent = 'An error occurred. Please try again.';
        recoveryError.style.display = 'block';
      }
    });
  }

  // Step 2: Password reset
  if (resetPasswordForm) {
    resetPasswordForm.addEventListener('submit', (e) => {
      e.preventDefault();

      resetError.style.display = 'none';
      resetSuccess.style.display = 'none';

      const newPassword = newPasswordInput.value;
      const confirmPassword = confirmPasswordInput.value;

      // Validation
      if (!newPassword || !confirmPassword) {
        resetError.textContent = 'Please enter both passwords.';
        resetError.style.display = 'block';
        return;
      }

      if (newPassword.length < 6) {
        resetError.textContent = 'Password must be at least 6 characters long.';
        resetError.style.display = 'block';
        return;
      }

      if (newPassword !== confirmPassword) {
        resetError.textContent = 'Passwords do not match. Please try again.';
        resetError.style.display = 'block';
        confirmPasswordInput.value = '';
        confirmPasswordInput.focus();
        return;
      }

      // Update password in localStorage
      try {
        const users = JSON.parse(localStorage.getItem('debp_users')) || {};
        
        if (users[recoveredUsername]) {
          users[recoveredUsername].password = newPassword;
          localStorage.setItem('debp_users', JSON.stringify(users));
          
          resetSuccess.textContent = 'Password has been reset successfully!';
          resetSuccess.style.display = 'block';

          setTimeout(() => {
            step2Container.style.display = 'none';
            step3Container.style.display = 'block';
          }, 1000);
        } else {
          resetError.textContent = 'Error updating password. Please try again.';
          resetError.style.display = 'block';
        }
      } catch (error) {
        resetError.textContent = 'An error occurred. Please try again.';
        resetError.style.display = 'block';
      }
    });
  }
});
