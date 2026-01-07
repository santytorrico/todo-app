import express from "express";
import { generateSummary } from "../utils/taskSummaryUtils.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/combined-summary", authMiddleware, async (req, res) => {
    const { tasks } = req.body;
    
    if (!Array.isArray(tasks) || tasks.length === 0) {
        return res.status(400).json({ message: "Tasks must be a non-empty array" });
    }
    
    try {
        const combinedText = tasks
            .map(task => {
                const title = task.title ? `Title: ${task.title}` : '';
                const description = task.description ? `Description: ${task.description}` : '';
                
                if (title && description) {
                    return `${title}\n${description}`;
                } else if (title) {
                    return title;
                } else if (description) {
                    return description;
                }
                return '';
            })
            .filter(text => text.trim() !== "")
            .join("\n\n");
            
        if (!combinedText) {
            return res.json({ summary: "No valid content provided." });
        }
        const summary = await generateSummary(combinedText);
        res.json({ summary });
    } catch (error) {
        res.status(500).json({ message: "Error generating summary", error });
    }
});
export default router;