const Massage = require('../models/MassageModel');

// @desc    Get all massages
// @route   GET /api/massages/
// @access  Public
exports.getMassages = async (req, res, next) => {
    // Define query for last result , reqQuery to be array of req.query
    let query;
    let reqQuery = { ...req.query };

    // Define field to remove before process and remove field from reqQuery
    const removeFields = ["sort", "select", "page", "limit"];
    removeFields.forEach(param => delete reqQuery[param]);

    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(/\b(lt|lte|gt|gte|in)\b/g, match => `$${match}`);
    query = Massage.find(JSON.parse(queryStr));

    // Select
    if (req.query.select) {
        const field = req.query.select.split(',').join(' ');
        query = query.select(field);
    }

    // Sort
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else {
        query = query.sort('name');
    }

    // Page
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Massage.countDocuments(JSON.parse(queryStr));

    query = query.skip(startIndex).limit(limit);        // skip to start index

    try {
        // excuting query
        const massages = await query;
        const pagination = {};          // pagination result

        // Has previous page
        if (startIndex > 0) {
            pagination.prev = {
                page: page - 1,
                limit
            }
        }

        // Has next page
        if (endIndex < total) {
            pagination.next = {
                page: page+1,
                limit
            }
        }

        res.status(200).send({
            success: true,
            count: massages.length,
            pagination,
            data: massages
        })
    } catch (err) {
        console.log(err);
        res.status(500).send({
            success: false,
            message: "Server Error"
        })
    }
};

// @desc    Get single massage
// @route   GET /api/massages/:id
// @access  Public
exports.getMassageByID = async (req, res, next) => {
    try {
        // find single massage in database by ID
        const massage = await Massage.findById(req.params.id);

        if (!massage) {
            return res.status(404).send({
                success: false,
                message: `Not found massage ID of ${req.params.id}`
            })
        }

        return res.status(200).send({
            success: true,
            data: massage
        })

    } catch (err) {
        // If the error is due to an invalid ObjectID format
        if (err.kind === 'ObjectId') {
            return res.status(400).json({
                success: false,
                message: `Massage not found with ID of ${req.params.id}, invalid ID format`
            });
        }

        // For other types of errors, it's likely a server error
        res.status(500).json({
            success: false,
            message: `Error retrieving massage with ID of ${req.params.id}`
        });
    }
}

// @desc    Create a new massage
// @route   POST /api/massages/
// @access  Private
exports.createMassage = async (req, res, next) => {
    try {
        const massage = await Massage.create(req.body);
        
        res.status(201).send({
            success: true,
            data: massage
        })
    } catch (err) {
        // Handling validation errors
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);

            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: messages // Providing detailed info about what went wrong
            });
        }

        // For other types of errors, it's likely a server error
        res.status(500).json({
            success: false,
            message: 'Failed to create massage'
        });
    }
}

// @desc    Update a massage by id
// @route   PUT /api/massages/:id
// @access  Private
exports.updateMassage = async (req, res, next) => {
    try {
        // Find before execute updating process
        let massage = await Massage.findById(req.params.id);

        if (!massage) {
            return res.status(404).send({
                success: false,
                message: `Not found massage ID of ${req.params.id}`
            })
        }

        // Execute updating process
        massage = await Massage.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })

        res.status(200).send({
            success: true,
            data: massage
        })

    } catch (err) {
        return res.status(500).send({
            success: false,
            message: err.message
        })
    }
}

// @desc    Delete a massage by id
// @route   DELETE /api/massages/:id
// @access  Private
exports.deleteMassage = async (req, res, next) => {
    try {
        // Find before execute deleting process
        let massage = await Massage.findById(req.params.id);

        if (!massage) {
            return res.status(404).send({
                success: false,
                message: `Not found massage ID of ${req.params.id}`  
            })
        }

        // Execute deleting process
        await massage.deleteOne();

        return res.status(200).send({
            success: true,
            data: {}
        })

    } catch (err) {
        console.log(err.message);
        return res.status(500).send({
            success: false,
            message: "Cannot delete massage"
        })
    }
}

// exports.test = async (req, res, next) => {
//     const massages = await Massage.find({});
//     res.status(200).send({
//         success: true,
//         data: massages
//     })
// }

