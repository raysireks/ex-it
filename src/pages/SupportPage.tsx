import React from 'react';

interface SupportPageProps {
  onNavigate: (page: string) => void;
}

const SupportPage: React.FC<SupportPageProps> = ({ onNavigate }) => {
  const supportCards = [
    {
      id: 'community',
      icon: '👥',
      title: 'Community Support',
      description: 'Connect with others who understand your journey. Share experiences and find strength in numbers.',
      action: () => alert('Community feature coming soon!'),
    },
    {
      id: 'professional',
      icon: '🩺',
      title: 'Professional Help',
      description: 'Access licensed therapists and counselors who specialize in relationship recovery.',
      action: () => alert('Professional help resources coming soon!'),
    },
    {
      id: 'stalling',
      icon: '⏸️',
      title: 'Stalling Methods',
      description: 'Proven techniques to delay or prevent reaching out when the urge strikes.',
      action: () => alert('Stalling methods: Call a friend, go for a walk, write in your journal, wait 24 hours.'),
    },
    {
      id: 'ai-chat',
      icon: '🤖',
      title: 'AI Chat Support',
      description: 'Talk to our AI companion 24/7 when you need someone to listen.',
      action: () => alert('AI Chat feature coming soon!'),
    },
    {
      id: 'reasons',
      icon: '📝',
      title: 'Reasons for Leaving',
      description: 'Remember why you made this decision. Keep your "why" list handy.',
      action: () => alert('Create and save your personal reasons list (feature coming soon)'),
    },
    {
      id: 'forward',
      icon: '🚀',
      title: 'Looking Forward',
      description: 'Visualize your future self. Set goals and celebrate your progress.',
      action: () => onNavigate('resources'),
    },
  ];

  return (
    <div className="support-page">
      <div className="page-content">
        <h1>Support & Resources</h1>
        <div className="support-grid">
          {supportCards.map((card) => (
            <div key={card.id} className="support-card" onClick={card.action}>
              <div className="icon">{card.icon}</div>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
