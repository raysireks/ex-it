import React, { useState, useEffect } from 'react';
import { useNoContactCounter } from '../hooks/useNoContactCounter';
import BlurbPopover from '../components/BlurbPopover';
import WarningModal from '../components/WarningModal';
import { blurbService } from '../services/blurbService';
import { Blurb } from '../types';

const LandingPage: React.FC = () => {
  const { days } = useNoContactCounter();
  const [showBlurbs, setShowBlurbs] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [blurbOfTheDay, setBlurbOfTheDay] = useState<Blurb | null>(null);

  useEffect(() => {
    // Load the blurb of the day (top voted blurb)
    const loadBlurbOfTheDay = async () => {
      const blurbs = await blurbService.getTopBlurbs(1);
      if (blurbs.length > 0) {
        setBlurbOfTheDay(blurbs[0]);
      }
    };
    loadBlurbOfTheDay();
  }, []);

  const handleMessageClick = () => {
    setShowWarning(true);
  };

  const handleProceed = () => {
    setShowWarning(false);
    alert('Remember: You are strong. You deserve better. This too shall pass.');
  };

  return (
    <div className="landing-page">
      <div className="counter-container">
        <div className="counter-circle" onClick={() => setShowBlurbs(true)}>
          <div className="days">{days}</div>
          <div className="label">Days of No Contact</div>
        </div>
        {blurbOfTheDay && (
          <div className="blurb-of-day">
            <div className="blurb-icon">💪</div>
            <div className="blurb-text">"{blurbOfTheDay.text}"</div>
            <div className="blurb-attribution">— {blurbOfTheDay.username}</div>
          </div>
        )}
        <button className="message-button" onClick={handleMessageClick}>
          I Want to Message My Ex
        </button>
      </div>

      {showBlurbs && <BlurbPopover onClose={() => setShowBlurbs(false)} />}
      {showWarning && (
        <WarningModal
          onClose={() => setShowWarning(false)}
          onProceed={handleProceed}
        />
      )}
    </div>
  );
};

export default LandingPage;
