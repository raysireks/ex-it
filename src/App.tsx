import { useState, useEffect } from 'react';
import './App.css';
import SplashScreen from './components/SplashScreen';
import LandingPage from './pages/LandingPage';
import SupportPage from './pages/SupportPage';
import ResourcesPage from './pages/ResourcesPage';
import ChatbotPage from './pages/ChatbotPage';
import LoginModal from './components/LoginModal';
import Logo from './components/Logo';
import { useAuth } from './hooks/useAuth';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentPage, setCurrentPage] = useState('landing');
  const [showLogin, setShowLogin] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  // Prevent body scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onNavigate={setCurrentPage} />;
      case 'support':
        return <SupportPage onNavigate={setCurrentPage} />;
      case 'resources':
        return <ResourcesPage />;
      case 'chatbot':
        return <ChatbotPage onBack={() => setCurrentPage('landing')} />;
      default:
        return <LandingPage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="app">
      <div className="header">
        <div className="logo-wrapper" onClick={() => setCurrentPage('landing')}>
          <Logo size="medium" className="logo-svg" />
        </div>
        <button
          className={`hamburger ${mobileMenuOpen ? 'open' : ''}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <nav className={`nav ${mobileMenuOpen ? 'nav-open' : ''}`}>
          <button className="nav-button" onClick={() => {
            setCurrentPage('landing');
            setMobileMenuOpen(false);
          }}>
            Home
          </button>
          <button className="nav-button" onClick={() => {
            setCurrentPage('support');
            setMobileMenuOpen(false);
          }}>
            Support
          </button>
          <button className="nav-button" onClick={() => {
            setCurrentPage('resources');
            setMobileMenuOpen(false);
          }}>
            Resources
          </button>
          {user ? (
            <>
              <button className="nav-button">
                👤 {user.displayName || user.email}
              </button>
              <button className="nav-button" onClick={() => {
                logout();
                setMobileMenuOpen(false);
              }}>
                Logout
              </button>
            </>
          ) : (
            <button className="nav-button" onClick={() => {
              setShowLogin(true);
              setMobileMenuOpen(false);
            }}>
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
