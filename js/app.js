// app.js - FI Journey Application

const FI_JOURNEY_STATIC_PASSWORD = 'Freedom2026';
const FI_JOURNEY_AUTH_KEY = 'fiJourneyAuthenticated';
const FI_JOURNEY_PROTECTED_PAGES = [
  'portfolio.html',
  'bucket-strategy.html',
  'swp.html',
  'journey.html'
];

console.log('FI Journey Website Loaded Successfully');

// Initialize app on page load
document.addEventListener('DOMContentLoaded', async function() {
  initializeNavigation();
  await checkAuth();
  loadPortfolioData();
});

// Navigation handler
function initializeNavigation() {
  console.log('Navigation initialized');
}

async function checkAuth() {
  const pageName = window.location.pathname.split('/').pop();
  if (!FI_JOURNEY_PROTECTED_PAGES.includes(pageName)) {
    return;
  }

  const isAuthenticated = sessionStorage.getItem(FI_JOURNEY_AUTH_KEY) === 'true';
  if (isAuthenticated) {
    return;
  }

  createPasswordModal();

  let attempts = 0;
  let allowed = false;

  while (attempts < 3 && !allowed) {
    const entry = await promptForPassword('Enter the access password to continue browsing the site:');
    if (entry === null) {
      break;
    }

    if (entry === FI_JOURNEY_STATIC_PASSWORD) {
      sessionStorage.setItem(FI_JOURNEY_AUTH_KEY, 'true');
      allowed = true;
      break;
    }

    attempts += 1;
    await showPasswordError('Password incorrect. Please try again.');
  }

  hidePasswordModal();

  if (!allowed) {
    alert('Access denied. Redirecting to home page.');
    window.location.href = 'index.html';
  }
}

function createPasswordModal() {
  if (document.getElementById('password-modal')) {
    return;
  }

  const modal = document.createElement('div');
  modal.id = 'password-modal';
  modal.innerHTML = `
    <div class="modal-backdrop"></div>
    <div class="modal-card">
      <h2>Secure Access</h2>
      <p>Please enter the password to continue.</p>
      <input id="password-input" type="password" placeholder="Password" autocomplete="current-password" />
      <div class="modal-actions">
        <button id="password-submit" type="button">Submit</button>
        <button id="password-cancel" type="button">Cancel</button>
      </div>
      <p id="password-error" class="modal-error"></p>
    </div>
  `;

  document.body.appendChild(modal);

  document.getElementById('password-input').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      document.getElementById('password-submit').click();
    }
    if (event.key === 'Escape') {
      event.preventDefault();
      document.getElementById('password-cancel').click();
    }
  });

  document.body.classList.add('modal-open');
  document.getElementById('password-input').focus();
}

function hidePasswordModal() {
  const modal = document.getElementById('password-modal');
  if (modal) {
    modal.remove();
  }
  document.body.classList.remove('modal-open');
}

function promptForPassword(message) {
  return new Promise((resolve) => {
    const input = document.getElementById('password-input');
    const error = document.getElementById('password-error');
    const submit = document.getElementById('password-submit');
    const cancel = document.getElementById('password-cancel');

    if (!input || !submit || !cancel || !error) {
      resolve(null);
      return;
    }

    error.textContent = '';
    input.value = '';
    input.placeholder = message;
    input.focus();

    const handleSubmit = () => {
      cleanup();
      resolve(input.value);
    };

    const handleCancel = () => {
      cleanup();
      resolve(null);
    };

    const cleanup = () => {
      submit.removeEventListener('click', handleSubmit);
      cancel.removeEventListener('click', handleCancel);
      input.removeEventListener('passwordSubmit', handleSubmit);
      input.removeEventListener('passwordCancel', handleCancel);
    };

    input.addEventListener('passwordSubmit', handleSubmit);
    input.addEventListener('passwordCancel', handleCancel);
    submit.addEventListener('click', handleSubmit);
    cancel.addEventListener('click', handleCancel);
  });
}

function showPasswordError(message) {
  return new Promise((resolve) => {
    const error = document.getElementById('password-error');
    if (!error) {
      resolve();
      return;
    }
    error.textContent = message;
    setTimeout(resolve, 300);
  });
}

// Load portfolio data from JSON
function loadPortfolioData() {
  fetch('../data/portfolio.json')
    .then(response => response.json())
    .then(data => {
      console.log('Portfolio data loaded:', data);
      // Process data as needed
    })
    .catch(error => console.error('Error loading portfolio data:', error));
}

// Utility function to format currency
function formatCurrency(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value);
}
