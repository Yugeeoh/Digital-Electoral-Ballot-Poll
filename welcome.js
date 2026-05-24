// ============================================
// HOME PAGE INTERACTIVITY
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  initializeNavigation();
  initializeScrollEffects();
  initializeAnimations();
  handleNewsletterSignup();
});

// ============================================
// NAVIGATION FUNCTIONALITY
// ============================================

function initializeNavigation() {
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Mobile menu toggle
  if (hamburger) {
    hamburger.addEventListener('click', function() {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
    });
  }

  // Close menu when link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      hamburger?.classList.remove('active');
      navMenu?.classList.remove('active');
    });
  });

  // Highlight active navigation on scroll
  updateActiveNavigation();
  window.addEventListener('scroll', updateActiveNavigation);
}

function updateActiveNavigation() {
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (scrollY >= sectionTop - 200) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (current && link.getAttribute('href').includes(current)) {
      link.classList.add('active');
    }
  });
}

// ============================================
// SCROLL EFFECTS
// ============================================

function initializeScrollEffects() {
  // Parallax effect on hero
  const heroSection = document.querySelector('.hero');
  if (heroSection) {
    window.addEventListener('scroll', function() {
      const scrollPosition = window.scrollY;
      heroSection.style.backgroundAttachment = 'fixed';
      const parallaxElements = heroSection.querySelectorAll('.hero-shape');
      parallaxElements.forEach(el => {
        el.style.transform = `translateY(${scrollPosition * 0.5}px)`;
      });
    });
  }

  // Fade-in animations on scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Observe feature cards, stat boxes, and other elements
  const animatedElements = document.querySelectorAll(
    '.feature-card, .stat-box, .step, .highlight'
  );
  
  animatedElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'all 0.6s ease';
    observer.observe(element);
  });
}

// ============================================
// ANIMATIONS
// ============================================

function initializeAnimations() {
  // Animate stat numbers on scroll
  const animateNumbers = () => {
    const statNumbers = document.querySelectorAll('.stat-number, .stat-big');
    
    statNumbers.forEach(element => {
      const target = parseInt(element.textContent.replace(/\D/g, ''));
      const display = element.textContent.includes('+') ? 
        element.textContent.match(/[^\d]/g)?.join('') || '+' : 
        element.textContent.match(/[^\d]/g)?.join('') || '';

      if (isNaN(target)) return;

      let current = 0;
      const increment = target / 30;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        element.textContent = Math.round(current) + display;
      }, 50);
    });
  };

  // Trigger number animation when stats become visible
  const statsSection = document.querySelector('.hero-stats') || 
                       document.querySelector('.about-stats');
  
  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
          animateNumbers();
          entry.target.dataset.animated = 'true';
          statsObserver.unobserve(entry.target);
        }
      });
    });

    if (statsSection) statsObserver.observe(statsSection);
  }
}

// ============================================
// NEWSLETTER SIGNUP
// ============================================

function handleNewsletterSignup() {
  const newsletterForm = document.querySelector('.newsletter-form');
  if (!newsletterForm) return;

  newsletterForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const emailInput = this.querySelector('input[type="email"]');
    const email = emailInput.value.trim();
    const submitBtn = this.querySelector('button');

    // Basic email validation
    if (!isValidEmail(email)) {
      showMessage('Please enter a valid email address.', 'error');
      return;
    }

    // Save to localStorage
    const newsletters = JSON.parse(localStorage.getItem('debp_newsletters_v1') || '[]');
    
    if (newsletters.includes(email)) {
      showMessage('This email is already subscribed!', 'warning');
      return;
    }

    newsletters.push(email);
    localStorage.setItem('debp_newsletters_v1', JSON.stringify(newsletters));

    // Show success message
    showMessage('Thank you for subscribing!', 'success');
    emailInput.value = '';

    // Disable button temporarily
    const originalText = submitBtn.textContent;
    submitBtn.textContent = '✓ Subscribed!';
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }, 3000);
  });
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function showMessage(text, type) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message message-${type}`;
  messageDiv.textContent = text;
  messageDiv.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    font-weight: 600;
    z-index: 2000;
    animation: slideInUp 0.3s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    max-width: 300px;
  `;

  if (type === 'success') {
    messageDiv.style.background = '#10b981';
    messageDiv.style.color = 'white';
  } else if (type === 'error') {
    messageDiv.style.background = '#ef4444';
    messageDiv.style.color = 'white';
  } else if (type === 'warning') {
    messageDiv.style.background = '#f59e0b';
    messageDiv.style.color = 'white';
  }

  document.body.appendChild(messageDiv);

  setTimeout(() => {
    messageDiv.remove();
  }, 4000);
}

// ============================================
// SMOOTH SCROLL TO SECTIONS
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    
    // Skip if it's just #
    if (href === '#') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const targetElement = document.querySelector(href);
    if (targetElement) {
      e.preventDefault();
      const offsetTop = targetElement.offsetTop - 70;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  });
});

// ============================================
// BUTTON INTERACTIONS
// ============================================

const buttons = document.querySelectorAll('.btn');
buttons.forEach(button => {
  button.addEventListener('click', function(e) {
    // Add ripple effect
    const ripple = document.createElement('span');
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: rgba(255, 255, 255, 0.6);
      border-radius: 50%;
      transform: scale(0);
      animation: ripple 0.6s ease;
      pointer-events: none;
    `;

    // Add animation if not already in stylesheet
    if (!document.querySelector('style[data-ripple]')) {
      const style = document.createElement('style');
      style.setAttribute('data-ripple', 'true');
      style.textContent = `
        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }

    this.style.position = 'relative';
    this.style.overflow = 'hidden';
    this.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
  });
});

// ============================================
// ARROW NAVIGATION BETWEEN STEPS
// ============================================

function addStepArrows() {
  const steps = document.querySelectorAll('.step');
  steps.forEach((step, index) => {
    if (index < steps.length - 1) {
      const arrow = document.createElement('div');
      arrow.className = 'step-arrow';
      arrow.textContent = '→';
      
      // Insert arrow after the step (positioned absolutely)
      const nextStep = steps[index + 1];
      const stepContainer = step.parentElement;
      
      if (stepContainer) {
        arrow.style.cssText = `
          position: absolute;
          right: -2rem;
          top: 2rem;
          color: #667eea;
          font-size: 2rem;
          font-weight: bold;
        `;
        step.style.position = 'relative';
      }
    }
  });
}

// Initialize after DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', addStepArrows);
} else {
  addStepArrows();
}

// ============================================
// FORM VALIDATIONS
// ============================================

function addFormValidation() {
  const forms = document.querySelectorAll('form');
  
  forms.forEach(form => {
    const inputs = form.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
      input.addEventListener('blur', function() {
        validateField(this);
      });

      input.addEventListener('input', function() {
        if (this.classList.contains('invalid')) {
          validateField(this);
        }
      });
    });

    form.addEventListener('submit', function(e) {
      let isValid = true;
      inputs.forEach(input => {
        if (!validateField(input)) {
          isValid = false;
        }
      });

      if (!isValid) {
        e.preventDefault();
      }
    });
  });
}

function validateField(field) {
  const value = field.value.trim();
  const type = field.getAttribute('type') || field.tagName.toLowerCase();

  if (!value && field.hasAttribute('required')) {
    setFieldError(field, 'This field is required');
    return false;
  }

  if (type === 'email' && value && !isValidEmail(value)) {
    setFieldError(field, 'Please enter a valid email');
    return false;
  }

  clearFieldError(field);
  return true;
}

function setFieldError(field, message) {
  field.classList.add('invalid');
  let errorDiv = field.nextElementSibling;
  
  if (!errorDiv?.classList?.contains('error-message')) {
    errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    field.parentElement.insertBefore(errorDiv, field.nextSibling);
  }
  
  errorDiv.textContent = message;
  errorDiv.style.cssText = `
    color: #ef4444;
    font-size: 0.85rem;
    margin-top: 0.25rem;
    display: block;
  `;
}

function clearFieldError(field) {
  field.classList.remove('invalid');
  const errorDiv = field.nextElementSibling;
  
  if (errorDiv?.classList?.contains('error-message')) {
    errorDiv.remove();
  }
}

// Initialize form validation
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', addFormValidation);
} else {
  addFormValidation();
}

// ============================================
// ACCESSIBILITY IMPROVEMENTS
// ============================================

// Add keyboard navigation for buttons
document.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    if (e.target.classList.contains('nav-link')) {
      e.target.click();
    }
  }
});

// Focus visible for keyboard navigation
document.addEventListener('keydown', function(e) {
  if (e.key === 'Tab') {
    document.body.classList.add('keyboard-nav');
  }
});

document.addEventListener('mousedown', function() {
  document.body.classList.remove('keyboard-nav');
});

// Add keyboard focus styles
const style = document.createElement('style');
style.textContent = `
  body.keyboard-nav .btn:focus,
  body.keyboard-nav .nav-link:focus,
  body.keyboard-nav input:focus,
  body.keyboard-nav textarea:focus {
    outline: 2px solid #667eea;
    outline-offset: 2px;
  }
`;
document.head.appendChild(style);