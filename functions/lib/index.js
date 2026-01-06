"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chat = void 0;
const functions = require("firebase-functions");
const generative_ai_1 = require("@google/generative-ai");
// Initialize Gemini with API key from environment variables
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new generative_ai_1.GoogleGenerativeAI(apiKey || "mock-key");
exports.chat = functions.https.onCall(async (data, context) => {
    // Check for missing API Key to allow basic connectivity testing
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
        functions.logger.warn("GEMINI_API_KEY is missing or default. Returning mock response.");
        return { text: "This is a mock response from Gemini (Developer API). Please set GEMINI_API_KEY in functions/.env." };
    }
    const userMessage = data.message;
    if (!userMessage) {
        throw new functions.https.HttpsError('invalid-argument', 'The function must be called with one argument "message".');
    }
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `
        System: You are a supportive, empathetic, and firm assistant for someone who is going through a breakup and trying to maintain "No Contact" with their ex. 
        Your goal is to discourage them from reaching out to their ex, remind them of their worth, and help them process their emotions constructively. 
        Be kind but direct. Do not encourage contact. Validate their feelings but steer them towards self-care and growth. 
        Keep responses concise (under 50 words) and impactful.

        User: ${userMessage}
        `;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const responseText = response.text();
        return { text: responseText };
    }
    catch (error) {
        functions.logger.error("Gemini API Error:", error);
        throw new functions.https.HttpsError('internal', 'Failed to generate response.', error.message);
    }
});
//# sourceMappingURL=index.js.map