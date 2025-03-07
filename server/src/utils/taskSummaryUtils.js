import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateSummary = async (description) => {
    if (!description || description.trim() === "") {
        return "No description provided.";
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const prompt = `Summarize this task description in one sentence: ${description}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return text?.trim() || "Could not generate summary.";
    } catch (error) {
        console.error("Gemini Summary Error:", error);
        return "Summary generation failed.";
    }
};