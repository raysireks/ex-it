import React, { useState, useEffect, useRef } from 'react';
import { useNoContactCounter } from '../hooks/useNoContactCounter';
import { chatService, ChatMessage } from '../services/chatService';
import { useAuth } from '../hooks/useAuth';
import { blurbService } from '../services/blurbService';

interface ChatbotPageProps {
    onBack: () => void;
    mode?: 'normal' | 'already_contacted';
}

const ChatbotPage: React.FC<ChatbotPageProps> = ({ onBack, mode = 'normal' }) => {
    const { days } = useNoContactCounter();
    const { isAuthenticated } = useAuth();
    const [inputText, setInputText] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [botMessage, setBotMessage] = useState<string | null>(null);
    const [isZoomingOut, setIsZoomingOut] = useState(false);
    const [history, setHistory] = useState<ChatMessage[]>([]);
    const [encouragementQuote, setEncouragementQuote] = useState<string>("You're doing great. Stay strong on your journey.");

    const zoomTimeoutRef = useRef<number | null>(null);

    // Number of blurbs to fetch for random selection
    const BLURBS_TO_FETCH = 10;

    // Initial greeting based on mode
    useEffect(() => {
        if (mode === 'already_contacted') {
            setBotMessage("I'm here for you. It's okay that you reached out—healing isn't a straight line. Tell me what happened, or how you're feeling now.");
        }
    }, [mode]);

    // Load a random encouragement quote for non-authenticated users
    useEffect(() => {
        if (!isAuthenticated) {
            blurbService.getTopBlurbs(BLURBS_TO_FETCH)
                .then(blurbs => {
                    if (blurbs.length > 0) {
                        const randomBlurb = blurbs[Math.floor(Math.random() * blurbs.length)];
                        // Validate that the text exists and is not empty
                        if (randomBlurb.text && randomBlurb.text.trim()) {
                            setEncouragementQuote(randomBlurb.text);
                        } else {
                            setEncouragementQuote("Stay strong. You're on the right path.");
                        }
                    } else {
                        setEncouragementQuote("Stay strong. You're on the right path.");
                    }
                })
                .catch(error => {
                    console.error("Failed to load encouragement quotes:", error);
                    // Set a fallback quote if loading fails
                    setEncouragementQuote("Stay strong. You're on the right path.");
                });
        } else {
            // Clear the quote when user becomes authenticated
            setEncouragementQuote('');
        }
    }, [isAuthenticated]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim() || isProcessing || !isAuthenticated) return;

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
            // Get last 20 messages to ensure roleplay context limits (5 turns = 10 messages) are visible
            const contextHistory = history.slice(-20);
            const response = await chatService.sendMessage(messageToSend, contextHistory, mode === 'already_contacted' ? 'contacted' : 'normal');

            const userMsg: ChatMessage = { role: 'user', content: messageToSend };
            const modelMsg: ChatMessage = { role: 'model', content: response.text };

            // Update history with new exchange
            setHistory(prev => [
                ...prev,
                userMsg,
                modelMsg
            ]);

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
                <div className={`counter-circle glowing ${botMessage || isProcessing ? 'faded' : ''}`}>
                    <div className="days">{days}</div>
                    <div className="label">Days of No Contact</div>
                </div>

                {/* Chat Input */}
                <form className="chat-input-form" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder={isAuthenticated ? "Tell me what you want to say to them..." : "Login to use chat..."}
                        disabled={isProcessing || !isAuthenticated}
                        autoFocus={isAuthenticated}
                        className={!isAuthenticated ? 'disabled' : ''}
                    />
                    <button type="submit" disabled={!inputText.trim() || isProcessing || !isAuthenticated}>
                        {isProcessing ? '...' : 'Send'}
                    </button>
                </form>
            </div>

            <button className="back-button" onClick={onBack}>
                Exit Chat
            </button>

            {/* Show encouragement quote and login prompt for non-authenticated users */}
            {!isAuthenticated && encouragementQuote && (
                <div className="unauthenticated-message">
                    <div className="encouragement-quote">
                        "{encouragementQuote}"
                    </div>
                    <div className="login-prompt">
                        If you want interaction with the chat, please login
                    </div>
                </div>
            )}

            {botMessage && (
                <div className={`zoom-text-overlay ${isZoomingOut ? 'zooming-out' : 'zooming-in'}`}>
                    <div className="zoom-text-content">
                        {botMessage}
                    </div>
                </div>
            )}

            {!botMessage && isProcessing && (
                <div className="zoom-text-overlay zooming-in">
                    <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatbotPage;
