const User = require('../models/User');

// Get current user's profile
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .select('-password')
            .populate('projects');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Update current user's profile
exports.updateMe = async (req, res) => {
    try {
        const updates = { ...req.body };
        delete updates.password;
        const user = await User.findByIdAndUpdate(
            req.user._id,
            updates,
            { new: true, runValidators: true }
        ).select('-password');
        res.json(user);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};