const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Task = require('../models/Task');
const Project = require('../models/Project');

// Get all tasks for a project
router.get('/:projectId', auth, async (req, res) => {
    try {
        const project = await Project.findOne({ _id: req.params.projectId, userId: req.user._id });
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const tasks = await Task.find({ projectId: req.params.projectId });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tasks' });
    }
});

// Create a new task
router.post('/:projectId', auth, async (req, res) => {
    try {
        console.log("req.body", req.body);
        const project = await Project.findOne({ _id: req.params.projectId, userId: req.user._id });
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }


        const task = new Task({
            ...req.body,
            projectId: req.params.projectId
        });

        project.tasks.push(task._id);
        await project.save();

        await task.save();
        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: 'Error creating task' });
    }
});

// Update a task
router.patch('/:taskId', auth, async (req, res) => {
    try {
        const task = await Task.findById(req.params.taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const project = await Project.findOne({ _id: task.projectId, userId: req.user._id });
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Update dateCompleted if status is changed to completed
        if (req.body.status === 'completed' && task.status !== 'completed') {
            req.body.dateCompleted = new Date();
        } else if (req.body.status !== 'completed') {
            req.body.dateCompleted = null;
        }

        Object.assign(task, req.body);
        await task.save();
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: 'Error updating task' });
    }
});

// Delete a task
router.delete('/:taskId', auth, async (req, res) => {
    try {
        const task = await Task.findById(req.params.taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const project = await Project.findOne({ _id: task.projectId, userId: req.user._id });
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        await task.remove();
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting task' });
    }
});

// get tasks by user id
router.get('/', auth, async (req, res) => {
    try {
        console.log("req.user", req.user._id);
        const tasks = await Task.find({ userId: req.user._id });
        console.log("tasks", tasks);
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tasks' });
    }
});

module.exports = router;