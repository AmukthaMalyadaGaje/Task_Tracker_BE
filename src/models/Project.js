const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    progress: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['not-started', 'in-progress', 'completed'],
        default: 'not-started'
    },

    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
    }]
}, {
    timestamps: true
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;