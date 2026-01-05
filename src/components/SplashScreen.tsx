import React from 'react';

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
        <div className="logo-icon-large">💔→💚</div>
        <h1>Ex→It</h1>
      </div>
      <p>Break Free, Move Forward</p>
    </div>
  );
};

export default SplashScreen;
