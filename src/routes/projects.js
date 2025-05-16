const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Project = require('../models/Project');

// Get all projects for a user
router.get('/', auth, async (req, res) => {
    try {
        const projects = await Project.find({ userId: req.user._id });
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching projects' });
    }
});

// Get a project by ID
router.get('/:id', auth, async (req, res) => {
    try {
        const project = await Project.findOne({ _id: req.params.id, userId: req.user._id });
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.json(project);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching project' });
    }
});

// Update project progress
router.patch('/:id/progress', auth, async (req, res) => {
    try {
        const project = await Project.findOne({ _id: req.params.id, userId: req.user._id });
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        console.log("req.body.progress", req.body.progress);

        project.progress = req.body.completionPercentage;
        project.status = req.body.status;
        await project.save();
        res.json(project);
    } catch (error) {
        res.status(500).json({ message: 'Error updating project progress' });
    }
});


// Create a new project
router.post('/', auth, async (req, res) => {
    try {
        // Check if user has reached project limit
        const projectCount = await Project.countDocuments({ userId: req.user._id });
        if (projectCount >= 4) {
            return res.status(400).json({ message: 'Maximum project limit reached (4)' });
        }

        const project = new Project({
            ...req.body,
            userId: req.user._id
        });

        await project.save();
        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ message: 'Error creating project' });
    }
});

// Update a project
router.patch('/:id', auth, async (req, res) => {
    try {
        const project = await Project.findOne({ _id: req.params.id, userId: req.user._id });
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        Object.assign(project, req.body);
        await project.save();
        res.json(project);
    } catch (error) {
        res.status(500).json({ message: 'Error updating project' });
    }
});

// Delete a project
router.delete('/:id', auth, async (req, res) => {
    try {
        const project = await Project.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.json({ message: 'Project deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting project' });
    }
});

module.exports = router;