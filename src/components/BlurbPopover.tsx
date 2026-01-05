import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { blurbService } from '../services/blurbService';
import { Blurb } from '../types';

interface BlurbPopoverProps {
  onClose: () => void;
}

const BlurbPopover: React.FC<BlurbPopoverProps> = ({ onClose }) => {
  const { user, isAuthenticated } = useAuth();
  const [blurbs, setBlurbs] = useState<Blurb[]>([]);
  const [newBlurb, setNewBlurb] = useState('');
  const [votedBlurbs, setVotedBlurbs] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadBlurbs();
  }, []);

  const loadBlurbs = async () => {
    const topBlurbs = await blurbService.getTopBlurbs(10);
    setBlurbs(topBlurbs);
  };

  const handleVote = async (blurbId: string) => {
    if (!isAuthenticated) {
      alert('Please login to vote');
      return;
    }
    
    if (votedBlurbs.has(blurbId)) {
      return;
    }

    await blurbService.voteBlurb(blurbId);
    setVotedBlurbs(new Set(votedBlurbs).add(blurbId));
    loadBlurbs();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !user) {
      alert('Please login to submit a blurb');
      return;
    }

    if (newBlurb.trim().length < 10) {
      alert('Please write at least 10 characters');
      return;
    }

    await blurbService.submitBlurb(newBlurb, user.id, user.username);
    setNewBlurb('');
    loadBlurbs();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <h2>Community Wisdom</h2>
        
        <div className="blurb-list">
          {blurbs.map((blurb) => (
            <div key={blurb.id} className="blurb-item">
              <div className="blurb-content">
                <div className="blurb-text">{blurb.text}</div>
                <div className="blurb-author">— {blurb.username}</div>
              </div>
              <div className="blurb-vote">
                <button
                  className="vote-button"
                  onClick={() => handleVote(blurb.id)}
                  disabled={!isAuthenticated || votedBlurbs.has(blurb.id)}
                >
                  ↑
                </button>
                <span className="vote-count">{blurb.votes}</span>
              </div>
            </div>
          ))}
        </div>

        {isAuthenticated ? (
          <form className="submit-form" onSubmit={handleSubmit}>
            <h3>Share Your Wisdom</h3>
            <textarea
              value={newBlurb}
              onChange={(e) => setNewBlurb(e.target.value)}
              placeholder="What wisdom would you share with others on this journey?"
              maxLength={200}
            />
            <button type="submit" className="submit-button" disabled={newBlurb.trim().length < 10}>
              Submit Blurb
            </button>
          </form>
        ) : (
          <div className="login-required">
            Please login to submit your own blurb
          </div>
        )}
      </div>
    </div>
  );
};

export default BlurbPopover;
