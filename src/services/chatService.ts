export interface ChatResponse {
    text: string;
    duration: number; // Duration in milliseconds to show the text
}

// Average reading speed: 238 words per minute (approx 4 words per second)
const WORDS_PER_MINUTE = 238;

const RESPONSES = [
    "Take a deep breath. You are doing the right thing for yourself.",
    "Remember why you chose to step away. Growth happens in the discomfort.",
    "This feeling will pass. You are stronger than this moment.",
    "Don't trade your long-term peace for temporary relief.",
    "Focus on yourself today. You deserve your own energy.",
    "Healing isn't linear, but you are moving forward.",
    "Contacting them now resets the clock. Keep your streak alive.",
    "Your future self will thank you for staying strong right now."
];

export const chatService = {
    async sendMessage(message: string): Promise<ChatResponse> {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
        console.log("User sent:", message);

        // Pick a random response
        const text = RESPONSES[Math.floor(Math.random() * RESPONSES.length)];

        // Calculate duration based on word count
        const wordCount = text.split(/\s+/).length;
        // Base time of 2s + time to read words
        const readTimeMs = 2000 + (wordCount / (WORDS_PER_MINUTE / 60)) * 1000;

        return {
            text,
            duration: Math.ceil(readTimeMs)
        };
    }
};
