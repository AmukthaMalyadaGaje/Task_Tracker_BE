const Project = require('../models/Project');
const Task = require('../models/Task');

// Get all projects for a user
exports.getProjects = async (req, res) => {
    try {
        const projects = await Project.find({ user: req.user._id })
            .populate('tasks')
            .sort({ createdAt: -1 });
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single project
exports.getProject = async (req, res) => {
    try {
        const project = await Project.findOne({
            _id: req.params.id,
            user: req.user._id,
        }).populate('tasks');

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new project
exports.createProject = async (req, res) => {
    try {
        const project = new Project({
            ...req.body,
            user: req.user._id,
        });

        const savedProject = await project.save();
        res.status(201).json(savedProject);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update a project
exports.updateProject = async (req, res) => {
    try {
        const { title, description, status, completionPercentage } = req.body;
        const project = await Project.findOne({
            _id: req.params.id,
            user: req.user._id,
        });

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Update fields
        if (title) project.title = title;
        if (description) project.description = description;
        if (status) project.status = status;
        if (completionPercentage !== undefined) {
            project.completionPercentage = completionPercentage;
        }

        const updatedProject = await project.save();
        res.json(updatedProject);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a project
exports.deleteProject = async (req, res) => {
    try {
        const project = await Project.findOne({
            _id: req.params.id,
            user: req.user._id,
        });

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Delete all tasks associated with the project
        await Task.deleteMany({ project: project._id });

        // Delete the project
        await project.remove();
        res.json({ message: 'Project deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update project progress
exports.updateProjectProgress = async (req, res) => {
    try {
        const { status, completionPercentage } = req.body;
        const project = await Project.findOne({
            _id: req.params.id,
            user: req.user._id,
        });

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        if (status) project.status = status;
        if (completionPercentage !== undefined) {
            project.completionPercentage = completionPercentage;
        }

        const updatedProject = await project.save();
        res.json(updatedProject);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};