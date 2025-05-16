const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const socialSchema = new mongoose.Schema({
    name: String,
    url: String,
});

const activitySchema = new mongoose.Schema({
    date: Date,
    action: String,
});

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    country: {
        type: String,
        required: true,
        trim: true
    },
    avatar: {
        type: String,
        default: ''
    },
    role: {
        type: String,
        default: 'User'
    },
    bio: {
        type: String,
        default: ''
    },
    socials: [socialSchema],
    skills: [String],
    projects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    }],
    activity: [activitySchema],
    joined: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;