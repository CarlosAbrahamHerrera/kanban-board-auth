import Auth from './auth';

// Time to wait before logging out due to inactivity (in milliseconds)
// Default: 30 minutes
const INACTIVITY_TIMEOUT = 30 * 60 * 1000;

let inactivityTimer: number | undefined;

// Start the timer
const startTimer = () => {
  // Clear any existing timer
  if (inactivityTimer) {
    clearTimeout(inactivityTimer);
  }

  // Set a new timer
  inactivityTimer = window.setTimeout(() => {
    if (Auth.loggedIn()) {
      console.log('Session expired due to inactivity');
      Auth.logout();
    }
  }, INACTIVITY_TIMEOUT);
};

// Reset the timer
const resetTimer = () => {
  if (Auth.loggedIn()) {
    startTimer();
  }
};

// Initialize the inactivity tracking
const initInactivityTimer = () => {
  // Events to track user activity
  const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
  
  // Add event listeners
  events.forEach(event => {
    document.addEventListener(event, resetTimer, true);
  });
  
  // Start the initial timer if logged in
  if (Auth.loggedIn()) {
    startTimer();
  }
};

export default {
  initInactivityTimer,
  resetTimer,
  startTimer
}; 