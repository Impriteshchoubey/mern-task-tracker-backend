const express = require("express");
const Task = require("../models/Task");

const router = express.Router();

// POST /api/tasks - create new task
router.post("/", async (req, res) => {
  try {
    const { title, description, priority, dueDate, status } = req.body;

    if (!title || !dueDate) {
      return res.status(400).json({
        success: false,
        message: "Title and due date are required",
      });
    }

    const task = await Task.create({
      title,
      description,
      priority,
      dueDate,
      status,
    });

    res.status(201).json({ success: true, data: task });
  } catch (error) {
    console.error("Create task error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// GET /api/tasks - list tasks with optional filters/sort
router.get("/", async (req, res) => {
  try {
    const { status, priority, sort } = req.query;

    const query = {};
    if (status) query.status = status;
    if (priority) query.priority = priority;

    let tasksQuery = Task.find(query);

    if (sort === "dueDate") {
      tasksQuery = tasksQuery.sort({ dueDate: 1 });
    } else {
      tasksQuery = tasksQuery.sort({ createdAt: -1 });
    }

    const tasks = await tasksQuery;
    res.json({ success: true, data: tasks });
  } catch (error) {
    console.error("Get tasks error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// PUT /api/tasks/:id - update status or other fields
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status, title, description, priority, dueDate } = req.body;

    const updated = await Task.findByIdAndUpdate(
      id,
      { status, title, description, priority, dueDate },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    res.json({ success: true, data: updated });
  } catch (error) {
    console.error("Update task error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// DELETE /api/tasks/:id - delete task
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Task.findByIdAndDelete(id);
    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    res.json({ success: true, message: "Task deleted" });
  } catch (error) {
    console.error("Delete task error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
