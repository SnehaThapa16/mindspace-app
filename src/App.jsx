import React, { useState } from 'react';
import LogoIntro from './components/LogoIntro';
import Welcome from './components/Welcome';
import MainApp from './components/MainApp';

function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleIntroComplete = () => {
    setShowIntro(false);
  };

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <div className="App">
      {showIntro ? (
        <LogoIntro onComplete={handleIntroComplete} />
      ) : isAuthenticated ? (
        <MainApp onLogout={handleLogout} />
      ) : (
        <Welcome onAuthSuccess={handleAuthSuccess} />
      )}
    </div>
  );
}

export default App;