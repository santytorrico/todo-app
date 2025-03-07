import express from "express";
import { generateSummary } from "../utils/taskSummaryUtils.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

//Generate task summary
router.post("/summary", authMiddleware, async (req, res) => {
    const { description } = req.body;

    try {
        const summary = await generateSummary(description);
        res.json({ summary });
    } catch (error) {
        res.status(500).json({ message: "Error generating summary", error });
    }
});

export default router;