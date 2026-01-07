export interface ChatResponse {
    text: string;
    duration: number; // Duration in milliseconds to show the text
}

export interface ChatMessage {
    role: 'user' | 'model';
    content: string;
}

// Average reading speed: 238 words per minute (approx 4 words per second)
const WORDS_PER_MINUTE = 238;

import { ai } from '../lib/firebase';
import { getGenerativeModel } from 'firebase/ai';

export const chatService = {
    async sendMessage(message: string, history: ChatMessage[] = []): Promise<ChatResponse> {
        console.log("User sent:", message);

        try {
            // Using Vertex AI via Firebase SDK
            const model = getGenerativeModel(ai, { model: "gemini-2.5-flash" });

            // Format history for the prompt
            const historyText = history.map(msg =>
                `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
            ).join('\n');

            const prompt = `
            System: You are a supportive, empathetic, and firm assistant for someone who is going through a breakup and trying to maintain "No Contact" with their ex. 
            
            CONTEXT:
            ${historyText}
            
            CURRENT INTERACTION:
            User: ${message}

            INSTRUCTIONS:
            1. Your goal is to discourage them from reaching out to their ex, remind them of their worth, and help them process their emotions constructively.
            2. ask short questions to get the user to think about their planned actions. E.g "What do you hope to achieve by sending that?" or "How did you feel last time you reached out?"
            3. Provide support and encouragement ONLY if the current reply warrants it. Do not be generically supportive in every message.
            4. Be kind but direct. Do not encourage contact.
            5. Keep responses concise (under 50 words) and impactful.
            `;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            // Calculate duration based on word count
            const wordCount = text.split(/\s+/).length;
            // Base time of 2s + time to read words
            const readTimeMs = 2000 + (wordCount / (WORDS_PER_MINUTE / 60)) * 1000;

            return {
                text,
                duration: Math.ceil(readTimeMs)
            };
        } catch (error: any) {
            console.error("Error calling Gemini API:", error);
            // DEBUG: Show actual error to help user debug
            const errorText = `Error: ${error.message || String(error)}. (Check console for details)`;
            return {
                text: errorText,
                duration: 5000
            };
        }
    }
};
