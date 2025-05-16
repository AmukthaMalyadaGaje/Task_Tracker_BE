const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const auth = require('../middleware/auth');

// Apply auth middleware to all routes
router.use(auth);

// Get all projects
router.get('/', projectController.getProjects);

// Get a single project
router.get('/:id', projectController.getProject);

// Create a new project
router.post('/', projectController.createProject);

// Update a project
router.patch('/:id', projectController.updateProject);

// Update project progress
router.patch('/:id/progress', projectController.updateProjectProgress);

// Delete a project
router.delete('/:id', projectController.deleteProject);

module.exports = router;