// app.js - FI Journey Application

const FI_JOURNEY_STATIC_PASSWORD = 'Freedom2026';
const FI_JOURNEY_AUTH_KEY = 'fiJourneyAuthenticated';

console.log('FI Journey Website Loaded Successfully');

// Initialize app on page load
document.addEventListener('DOMContentLoaded', function() {
  initializeNavigation();
  checkAuth();
  loadPortfolioData();
});

// Navigation handler
function initializeNavigation() {
  console.log('Navigation initialized');
}

function checkAuth() {
  const isAuthenticated = sessionStorage.getItem(FI_JOURNEY_AUTH_KEY) === 'true';
  if (isAuthenticated) {
    return;
  }

  let attempts = 0;
  let allowed = false;

  while (attempts < 3 && !allowed) {
    const entry = prompt('Enter the access password to continue browsing the site:');
    if (entry === null) {
      break;
    }

    if (entry === FI_JOURNEY_STATIC_PASSWORD) {
      sessionStorage.setItem(FI_JOURNEY_AUTH_KEY, 'true');
      allowed = true;
      break;
    }

    attempts += 1;
    alert('Password incorrect. Please try again.');
  }

  if (!allowed) {
    alert('Access denied. Redirecting to home page.');
    window.location.href = 'index.html';
  }
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
