// app.js - FI Journey Application

console.log("FI Journey Website Loaded Successfully");

// Initialize app on page load
document.addEventListener('DOMContentLoaded', function() {
  initializeNavigation();
  loadPortfolioData();
});

// Navigation handler
function initializeNavigation() {
  // Add navigation logic here
  console.log("Navigation initialized");
}

// Load portfolio data from JSON
function loadPortfolioData() {
  fetch('../data/portfolio.json')
    .then(response => response.json())
    .then(data => {
      console.log("Portfolio data loaded:", data);
      // Process data as needed
    })
    .catch(error => console.error("Error loading portfolio data:", error));
}

// Utility function to format currency
function formatCurrency(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value);
}
