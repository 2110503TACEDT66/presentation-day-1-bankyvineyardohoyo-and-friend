const mongoose = require('mongoose')

const MassageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        unique: true,
        trim: true,
        maxlength: [50, 'name cannot be more than 50 characters']
    },
    address: {
        type: String,
        required: [true, 'Please add an address']
    },
    province: {
        type: String,
        required: [true, 'Please add a province']
    },
    tel: {
        type: String,
        required: [true, 'Please add a tel']
    },
    openTime: {
        type: String,
        required: [true, 'Please specify opening time'],
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please add a valid opening time in HH:MM format']
    },
    closeTime: {
        type: String,
        required: [true, 'Please specify closing time'],
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please add a valid closing time in HH:MM format']
    }
});

//Cascade delete reservations when a massage is deleted
MassageSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
    try {
        console.log(`Reservations being removed for massage ${this._id}`);
        await this.model('Reservation').deleteMany({ massage: this._id });
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model('Massage', MassageSchema);