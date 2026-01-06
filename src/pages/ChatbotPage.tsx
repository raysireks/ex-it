import React, { useState, useEffect, useRef } from 'react';
import { useNoContactCounter } from '../hooks/useNoContactCounter';
import { chatService } from '../services/chatService';

interface ChatbotPageProps {
    onBack: () => void;
}

const ChatbotPage: React.FC<ChatbotPageProps> = ({ onBack }) => {
    const { days } = useNoContactCounter();
    const [inputText, setInputText] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [botMessage, setBotMessage] = useState<string | null>(null);
    const [isZoomingOut, setIsZoomingOut] = useState(false);

    const zoomTimeoutRef = useRef<number | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim() || isProcessing) return;

        // Clear previous message states immediately if user interrupts
        if (zoomTimeoutRef.current) {
            clearTimeout(zoomTimeoutRef.current);
            zoomTimeoutRef.current = null;
        }
        setBotMessage(null);
        setIsZoomingOut(false);

        setIsProcessing(true);
        // Keep input for a moment or clear it? User request implied "text input box", 
        // usually simulated chats clear input. Let's clear it.
        const messageToSend = inputText;
        setInputText('');

        try {
            const response = await chatService.sendMessage(messageToSend);

            setBotMessage(response.text);
            setIsZoomingOut(false);

            // Set timeout to zoom out
            zoomTimeoutRef.current = window.setTimeout(() => {
                setIsZoomingOut(true);

                // After zoom out animation finishes (e.g. 0.8s), remove the text completely
                zoomTimeoutRef.current = window.setTimeout(() => {
                    setBotMessage(null);
                    setIsZoomingOut(false);
                }, 800); // Matches animation duration

            }, response.duration);

        } catch (error) {
            console.error("Chat error:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    // Cleanup
    useEffect(() => {
        return () => {
            if (zoomTimeoutRef.current) clearTimeout(zoomTimeoutRef.current);
        };
    }, []);

    return (
        <div className="chatbot-page">
            <div className="counter-container">
                {/* Glowing Circle */}
                <div className="counter-circle glowing">
                    <div className="days">{days}</div>
                    <div className="label">Days of No Contact</div>
                </div>

                {/* Chat Input */}
                <form className="chat-input-form" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Tell me what you want to say to them..."
                        disabled={isProcessing}
                        autoFocus
                    />
                    <button type="submit" disabled={!inputText.trim() || isProcessing}>
                        {isProcessing ? '...' : 'Send'}
                    </button>
                </form>

                <button className="back-button" onClick={onBack}>
                    Exit Chat
                </button>
            </div>

            {botMessage && (
                <div className={`zoom-text-overlay ${isZoomingOut ? 'zooming-out' : 'zooming-in'}`}>
                    <div className="zoom-text-content">
                        {botMessage}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatbotPage;
