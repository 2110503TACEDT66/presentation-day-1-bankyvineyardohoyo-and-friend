const User = require("../models/UserModel");

// @desc    Get all users
// @route   GET /api/users/
// @access  Private
exports.getUsers = async (req, res, next) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(401).send({
                success: false,
                message: `This user ID of ${req.user.id} not authorized to access this route`
            })
        }

        const users = await User.find({});

        res.status(200).send({
            success: true,
            data: users
        })
    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.message
        })
    }
}

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private
exports.getUserByID = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).send({
                success: false,
                message: `Not found user ID of ${req.params.id}`
            })
        }

        res.status(200).send({
            success: true,
            data: user
        })

    } catch (err) {
        console.log(err.message);
        return res.status(500).send({
            success: false,
            message: err.message
        })
    }
}

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private
exports.updateUser = async (req, res, next) => {
    try {
        let user = await User.findById(req.params.id);

        if (req.user.role !== "admin") {
            if (user && req.user.id === user._id.toString()) {
                user.set(req.body);
                await user.save();

                user = user.toObject();
                delete user.password;

                return res.status(200).send({
                    success: true,
                    data: user
                })
            } else {
                return res.status(401).send({
                    success: false,
                    message: `This user ID of ${req.params.id} not authorized to update this user`
                })
            }
        } else {
            if (!user) {
                return res.status(404).send({
                    success: false,
                    message: `Not found user ID of ${req.params.id}`
                })
            }

            user.set(req.body);
            await user.save();

            user = user.toObject();
            delete user.password;

            return res.status(200).send({
                success: true,
                data: user
            })
        }

    } catch (err) {
        console.log(err.message);
        // Handling validation errors
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);

            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: messages // Providing detailed info about what went wrong
            });
        }

        res.status(500).send({
            success: false,
            message: "Cannot update user"
        })
    }
}

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private
exports.deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (req.user.role !== "admin") {
            if (user && req.user.id === user._id.toString()) {
                await user.deleteOne();
                return res.status(200).send({
                    success: true,
                    data: {}
                })
            } else {
                return res.status(401).send({
                    success: false,
                    message: `This user ID of ${req.user.id} is not authorized to delete this user`
                })
            }
        } else {
            if (!user) {
                return res.status(404).send({
                    success: false,
                    message: `Not found user ID of ${req.params.id}`
                })
            }

            await user.deleteOne();

            return res.status(200).send({
                success: true,
                data: {}
            })
        }
    } catch (err) {
        console.log(err.message);
        res.status(500).send({
            success: false,
            message: "Cannot delete user"
        })
    }
}