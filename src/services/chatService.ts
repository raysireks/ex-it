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
    async sendMessage(message: string, history: ChatMessage[] = [], systemMode: 'normal' | 'contacted' = 'normal'): Promise<ChatResponse> {
        console.log("User sent:", message, "Mode:", systemMode);

        try {
            // Using Vertex AI via Firebase SDK
            const model = getGenerativeModel(ai, { model: "gemini-2.5-flash" });

            // Format history for the prompt
            const historyText = history.map(msg =>
                `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
            ).join('\n');

            const normalInstructions = `
            --- NORMAL MODE ---
            1. Your goal is to discourage them from reaching out to their ex, remind them of their worth, and help them process their emotions constructively.
            2. SYNTHESIZE the entire history. Do not just mirror the last message. Connect their current impulse to things they said earlier (e.g., "You mentioned he ignored you last week—why expect different now?").
            3. AVOID GENERIC TEMPLATES like "How would you feel about [latest message]?". This is robotic.
            4. Ask SHORT, varied questions. Use different strategies (Reality Testing, Past Evidence, Alignment).
            5. Provide support and encouragement ONLY if appropriate.
            6. Ask only ONE question at a time.
            `;

            const contactedInstructions = `
            --- ALREADY CONTACTED MODE ---
            1. The user has already contacted their ex. Do NOT shame them.
            2. Your goal is to help them process how it felt, what happened, and why it's important to return to No Contact.
            3. Be supportive and empathetic. Remind them that healing isn't linear.
            4. Ask questions about the interaction: "How did you feel right after sending it?", "Did you get the response you were hoping for?", "What can we do next time to pause before hitting send?".
            5. Help them identify the trigger that led to the contact.
            6. Encourage them to restart their counter and commit to a new period of healing.
            `;

            const prompt = `
            System: You are a supportive, empathetic, and firm assistant for someone who is going through a breakup and trying to maintain "No Contact" with their ex. 
            
            CONTEXT:
            ${historyText}
            
            CURRENT INTERACTION:
            User: ${message}

            INSTRUCTIONS:
            ${systemMode === 'contacted' ? contactedInstructions : normalInstructions}

            --- ROLEPLAY MODE TRIGGER ---
            If the user explicitly asks to roleplay or practice a conversation:
            1. FIRST, check if you have already sent the start message. 
            2. IF NOT, reply EXACTLY: "I am going to roleplay some exchanges but only up to 5 replies before I switch back. Ready?"
            
            --- STRICT ROLEPLAY MODE ---
            IF (and ONLY IF) you see your own message in history saying "I am going to roleplay...":
            1. Check how many messages YOU have sent since that start message.
            2. IF count < 5:
               - ACT STRICTLY as the ex. 
               - Do NOT add any helper text, advice, or "Breakdown:". 
               - Just be the ex (likely cold, neutral, or dismissive depending on context).
            3. IF count >= 5:
               - BREAK CHARACTER immediately.
               - Say: "[Roleplay finished] That was 5 exchanges. How did it feel to hear that? Did it give you what you were looking for?"

            --- GENERAL RULES ---
            - Keep responses concise (under 50 words).
            - Be kind but firm (in Normal Mode).
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
            const errorText = `Error: ${error.message || String(error)}. (Check console for details)`;
            return {
                text: errorText,
                duration: 5000
            };
        }
    }
};
