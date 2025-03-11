import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateSummary = async (content) => {
    if (!content || content.trim() === "") {
        return "No content provided.";
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const now = new Date();
        const hour = now.getHours();
        let timeOfDay = hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening";
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const currentDate = now.toLocaleDateString();
        const currentTime = now.toLocaleTimeString();
        const prompt = `Summarize these to do tasks in a concise paragraph (max 3 sentences), suggest a schedule to complete them, use as context Current Date: ${currentDate}, Current Time: ${currentTime}(${timeOfDay}, ${timezone}). : ${content}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();
        text = text.replace(/[*_`]/g, "").trim();
        return text || "Could not generate summary.";
    } catch (error) {
        console.error("Gemini Summary Error:", error);
        return "Summary generation failed.";
    }
};