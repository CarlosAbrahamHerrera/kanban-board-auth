import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import Navbar from './components/Navbar';
import inactivityTimer from './utils/inactivityTimer';

function App() {
  // Initialize inactivity timer to handle session timeout
  useEffect(() => {
    inactivityTimer.initInactivityTimer();
    
    // Cleanup when component unmounts
    return () => {
      // Remove event listeners when the component unmounts
      const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
      events.forEach(event => {
        document.removeEventListener(event, inactivityTimer.resetTimer, true);
      });
    };
  }, []);

  return (
    <div className='container'>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default App
