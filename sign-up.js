import { registerUser } from "../data/general-data.js";

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('signup-form');
  const passwordInput = document.getElementById('signup-password');
  const confirmPasswordInput = document.getElementById('signup-confirm-password');
  const passwordMatchError = document.getElementById('password-match-error');
  const signupError = document.getElementById('signup-error');
  const signupSuccess = document.getElementById('signup-success');

  if (!form) return;

  // Real-time password match validation
  const validatePasswords = () => {
    if (passwordInput.value && confirmPasswordInput.value) {
      if (passwordInput.value !== confirmPasswordInput.value) {
        passwordMatchError.style.display = 'block';
        return false;
      } else {
        passwordMatchError.style.display = 'none';
        return true;
      }
    }
    return true;
  };

  passwordInput.addEventListener('change', validatePasswords);
  confirmPasswordInput.addEventListener('change', validatePasswords);
  confirmPasswordInput.addEventListener('keyup', validatePasswords);

  // Form submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Hide previous messages
    signupError.style.display = 'none';
    signupSuccess.style.display = 'none';
    passwordMatchError.style.display = 'none';

    // Get form values
    const fullname = document.getElementById('signup-fullname').value.trim();
    const age = document.getElementById('signup-age').value.trim();
    const gender = document.getElementById('signup-gender').value;
    const address = document.getElementById('signup-address').value.trim();
    const city = document.getElementById('signup-city').value.trim();
    const state = document.getElementById('signup-state').value.trim();
    const phone = document.getElementById('signup-phone').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const nimc = document.getElementById('signup-nimc').value.trim();
    const username = document.getElementById('signup-username').value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    // Validate required fields
    if (!fullname || !age || !gender || !address || !city || !state || !phone || !email || !nimc || !username || !password) {
      signupError.textContent = '❌ Please fill in all required fields.';
      signupError.style.display = 'block';
      return;
    }

    // Validate username length
    if (username.length < 3) {
      signupError.textContent = '❌ Username must be at least 3 characters long.';
      signupError.style.display = 'block';
      return;
    }

    // Validate age
    const ageNum = parseInt(age);
    if (ageNum < 18) {
      signupError.textContent = '❌ You must be at least 18 years old to register.';
      signupError.style.display = 'block';
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      signupError.textContent = '❌ Please enter a valid email address.';
      signupError.style.display = 'block';
      return;
    }

    // Validate phone number (basic validation)
    const phoneRegex = /^\d{10,15}$/;
    if (!phoneRegex.test(phone.replace(/\D/g, ''))) {
      signupError.textContent = '❌ Please enter a valid phone number.';
      signupError.style.display = 'block';
      return;
    }

    // Validate NIMC ID (basic format: should have digits)
    if (!/\d/.test(nimc)) {
      signupError.textContent = '❌ Please enter a valid NIMC ID number.';
      signupError.style.display = 'block';
      return;
    }

    // Validate password match
    if (password !== confirmPassword) {
      passwordMatchError.style.display = 'block';
      return;
    }

    // Validate password length
    if (password.length < 6) {
      signupError.textContent = '❌ Password must be at least 6 characters long.';
      signupError.style.display = 'block';
      return;
    }

    // Prepare user data
    const userData = {
      fullname,
      age: ageNum,
      gender,
      address,
      city,
      state,
      phone,
      email,
      nimc,
      username,
      password
    };

    // Attempt registration
    const result = registerUser(username, password, email, userData);

    if (result.success) {
      // Store user profile data in localStorage
      const storageKey = `user_profile_${username}`;
      localStorage.setItem(storageKey, JSON.stringify(userData));
      
      // Store user joined date
      const joinedKey = `user_joined_${username}`;
      localStorage.setItem(joinedKey, new Date().toLocaleDateString());
      
      signupSuccess.textContent = result.message;
      signupSuccess.style.display = 'block';
      
      // Clear form
      form.reset();
      passwordMatchError.style.display = 'none';

      // Redirect to login after 2 seconds
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 2000);
    } else {
      signupError.textContent = result.message;
      signupError.style.display = 'block';
    }
  });
});
