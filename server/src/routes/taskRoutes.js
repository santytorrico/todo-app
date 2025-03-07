import express from "express";
import pool from "../config/db.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Create task
router.post("/", authMiddleware, async (req, res) => {
  const { title, description } = req.body;
  const userId = req.user.id;

  try {
    const newTask = await pool.query(
      "INSERT INTO tasks (user_id, title, description) VALUES ($1, $2, $3) RETURNING *",
      [userId, title, description]
    );

    res.status(201).json(newTask.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Error creating task", error });
  }
});

// Get all tasks for the logged-in user
router.get("/", authMiddleware, async (req, res) => {
  const userId = req.user.id;

  try {
    const tasks = await pool.query("SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC", [userId]);
    res.json(tasks.rows);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks", error });
  }
});

// Update task
router.put("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { title, description, is_completed } = req.body;
  const userId = req.user.id;

  try {
    const updatedTask = await pool.query(
      "UPDATE tasks SET title = $1, description = $2, is_completed = $3 WHERE id = $4 AND user_id = $5 RETURNING *",
      [title, description, is_completed, id, userId]
    );

    if (updatedTask.rows.length === 0) {
      return res.status(404).json({ message: "Task not found or unauthorized" });
    }

    res.json(updatedTask.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Error updating task", error });
  }
});

// Delete task
router.delete("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const deletedTask = await pool.query("DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *", [id, userId]);

    if (deletedTask.rows.length === 0) {
      return res.status(404).json({ message: "Task not found or unauthorized" });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting task", error });
  }
});

export default router;