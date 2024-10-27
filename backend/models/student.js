const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Email is required'],
        trim: true
    },
    gender: {
        type: String,
        enum: ['Male', 'Female']
    },
    ph_Num: {
        type: String,
        required: true,
        unique: true
    },
    duration: {
        type: String,
        required: true
    },
    domain: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Student = mongoose.model('Student', studentSchema);
module.exports = Student;
