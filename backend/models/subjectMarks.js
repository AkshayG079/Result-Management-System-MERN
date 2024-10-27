const { Schema, model, default: mongoose } = require('mongoose');

const subjectMarksSchema = Schema({
    studentId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Student'
    },
    attendance: {
        type: String,
        default: '0',            
    },
    assessment: {
        type: String,
        default: '0',        
    },
    project_Review: {
        type: String,
        default: '0',        
    },
    project_Submission: {
        type: String,
        default: '0',        
    },
    linkedIn_Post: {
        type: String,
        default: '0',        
    },
    percentage: {
        type: String,
        default: '0',        
    },
    total: {
        type: String,
        default: '0',        
    },
    grade: {
        type: String,     
    },

}, { timestamps: true }
)

const SubjectMarks = new model('SubjectMarks', subjectMarksSchema)
module.exports = SubjectMarks

