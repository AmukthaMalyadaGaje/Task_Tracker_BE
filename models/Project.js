const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        status: {
            type: String,
            enum: ['not-started', 'in-progress', 'completed'],
            default: 'not-started',
        },
        completionPercentage: {
            type: Number,
            min: 0,
            max: 100,
            default: 0,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        tasks: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Task',
            },
        ],
    },
    {
        timestamps: true,
    }
);

// Calculate completion percentage based on completed tasks
projectSchema.methods.calculateCompletion = function () {
    if (!this.tasks || this.tasks.length === 0) return 0;
    const completedTasks = this.tasks.filter(
        (task) => task.status === 'completed'
    ).length;
    return Math.round((completedTasks / this.tasks.length) * 100);
};

// Update completion percentage before saving
projectSchema.pre('save', function (next) {
    this.completionPercentage = this.calculateCompletion();
    next();
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;