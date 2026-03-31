import express from "express";
import { generateSummary, generateSummaryStream } from "../utils/taskSummaryUtils.js";
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

router.post("/combined-summary-stream", authMiddleware, async (req, res) => {
    const { tasks } = req.body;
    
    if (!Array.isArray(tasks) || tasks.length === 0) {
        return res.status(400).json({ message: "Tasks must be a non-empty array" });
    }
    
    // Set headers for Server-Sent Events (SSE)
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no'); // Disable buffering for nginx/render
    
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
            res.write(`data: ${JSON.stringify({ chunk: "No valid content provided.", done: true })}\n\n`);
            res.end();
            return;
        }
        
        // Stream chunks to client
        await generateSummaryStream(combinedText, (chunk) => {
            res.write(`data: ${JSON.stringify({ chunk, done: false })}\n\n`);
        });
        
        // Send completion signal
        res.write(`data: ${JSON.stringify({ chunk: "", done: true })}\n\n`);
        res.end();
        
    } catch (error) {
        console.error("Streaming error:", error);
        res.write(`data: ${JSON.stringify({ 
            chunk: `Error: ${error.message}`, 
            done: true,
            error: true 
        })}\n\n`);
        res.end();
    }
});


// router.post("/combined-summary-stream", authMiddleware, async (req, res) => {
//     const { tasks } = req.body;
    
//     if (!Array.isArray(tasks) || tasks.length === 0) {
//         return res.status(400).json({ message: "Tasks must be a non-empty array" });
//     }
    
//     // Set headers for SSE (Server-Sent Events)
//     res.setHeader('Content-Type', 'text/event-stream');
//     res.setHeader('Cache-Control', 'no-cache');
//     res.setHeader('Connection', 'keep-alive');
//     res.setHeader('X-Accel-Buffering', 'no'); // Disable nginx buffering if deployed
    
//     try {
//         const combinedText = tasks
//             .map(task => {
//                 const title = task.title ? `Title: ${task.title}` : '';
//                 const description = task.description ? `Description: ${task.description}` : '';
                
//                 if (title && description) {
//                     return `${title}\n${description}`;
//                 } else if (title) {
//                     return title;
//                 } else if (description) {
//                     return description;
//                 }
//                 return '';
//             })
//             .filter(text => text.trim() !== "")
//             .join("\n\n");
            
//         if (!combinedText) {
//             res.write(`data: ${JSON.stringify({ chunk: "No valid content provided.", done: true })}\n\n`);
//             res.end();
//             return;
//         }
        
//         // Stream chunks to client
//         await generateSummaryStream(combinedText, (chunk) => {
//             res.write(`data: ${JSON.stringify({ chunk, done: false })}\n\n`);
//         });
        
//         // Send completion signal
//         res.write(`data: ${JSON.stringify({ chunk: "", done: true })}\n\n`);
//         res.end();
        
//     } catch (error) {
//         console.error("Streaming error:", error);
//         res.write(`data: ${JSON.stringify({ 
//             chunk: `Error: ${error.message}`, 
//             done: true,
//             error: true 
//         })}\n\n`);
//         res.end();
//     }
// });

export default router;