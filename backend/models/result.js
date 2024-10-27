const mongoose = require('mongoose');

const resultSchema = mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    },
    subjectMarkId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubjectMarks"
    },
    status: {
        type: {
            type: String,
            enum: ['Pending', 'Approve', 'Rejected'],
            default: 'Pending'
        },
        message: {
            type: String,
            default: ''
        }
    }
}, { timestamps: true }
)

const Result = mongoose.model('Result', resultSchema)
module.exports = Result