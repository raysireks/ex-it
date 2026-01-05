import { useState } from 'react';
import './App.css';
import SplashScreen from './components/SplashScreen';
import LandingPage from './pages/LandingPage';
import SupportPage from './pages/SupportPage';
import ResourcesPage from './pages/ResourcesPage';
import LoginModal from './components/LoginModal';
import { useAuth } from './hooks/useAuth';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentPage, setCurrentPage] = useState('landing');
  const [showLogin, setShowLogin] = useState(false);
  const { user, logout } = useAuth();

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage />;
      case 'support':
        return <SupportPage onNavigate={setCurrentPage} />;
      case 'resources':
        return <ResourcesPage />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="app">
      <div className="header">
        <div className="logo" onClick={() => setCurrentPage('landing')}>
          Ex→It
        </div>
        <nav className="nav">
          <button className="nav-button" onClick={() => setCurrentPage('landing')}>
            Home
          </button>
          <button className="nav-button" onClick={() => setCurrentPage('support')}>
            Support
          </button>
          <button className="nav-button" onClick={() => setCurrentPage('resources')}>
            Resources
          </button>
          {user ? (
            <>
              <button className="nav-button">
                👤 {user.username}
              </button>
              <button className="nav-button" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <button className="nav-button" onClick={() => setShowLogin(true)}>
              Login
            </button>
          )}
        </nav>
      </div>
      
      {renderPage()}
      
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </div>
  );
}

export default App;
