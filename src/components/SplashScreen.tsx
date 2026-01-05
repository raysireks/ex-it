import React from 'react';
import Logo from './Logo';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="splash-screen">
      <div className="logo-container">
        <Logo size="large" className="splash-logo" />
      </div>
      <p>Break Free, Move Forward</p>
    </div>
  );
};

export default SplashScreen;
