const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed'],
        default: 'pending'
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    dateCreated: {
        type: Date,
        default: Date.now
    },
    dateCompleted: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;