import React from 'react';

interface WarningModalProps {
  onClose: () => void;
  onProceed: () => void;
}

const WarningModal: React.FC<WarningModalProps> = ({ onClose, onProceed }) => {
  return (
    <div className="modal-overlay warning-modal" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <h2>⚠️ Wait! Think First</h2>
        <p>
          Reaching out to your ex might feel good in the moment, but it often leads to more pain and delays your healing.
        </p>
        <p>
          Remember why you started no contact. You deserve peace and growth.
        </p>
        <p>
          Are you sure you want to proceed?
        </p>
        <div className="warning-actions">
          <button className="cancel-button" onClick={onClose}>
            Stay Strong
          </button>
          <button className="proceed-button" onClick={onProceed}>
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};

export default WarningModal;
