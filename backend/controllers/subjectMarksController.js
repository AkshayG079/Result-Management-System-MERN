const asyncHandler = require('express-async-handler');
const SubjectMarks = require('../models/subjectMarks');
const Student = require('../models/student');

const allStudentSubjectMarksList = asyncHandler(async (req, res) => {
    const list = await SubjectMarks.find();
    if (!list) {
        return res.status(400).send({ message: "Failed to fetch the record." });
    }
    res.status(200).send(list)
})

const addStudentSubjectMarks = asyncHandler(async (req, res) => {
    const { studentId, attendance, assessment, projectReview, projectSubmission, linkedIn_Post, percentage, total, grade } = req.body;

    const isStudentExist = await Student.findOne({ _id: studentId });
    const isExist = await SubjectMarks.findOne({ studentId: studentId });

    if (!isStudentExist) {
        return res.status(400).send({ message: "The student does not exist in the database." })
    }

    if (isExist) {
        return res.status(400).send({ message: "Already Exist" })
    }

    if (!attendance || !assessment || !projectReview || !projectSubmission || !linkedIn_Post || !percentage || !total || !grade) {
        return res.status(400).send({ message: "Missing data passed into request" })
    }

    let subjectMark = await SubjectMarks.create({
        studentId,
        attendance,
        assessment,
        project_Review: projectReview,
        project_Submission: projectSubmission,
        linkedIn_Post,
        percentage,
        total,
        grade
    })

    res.status(200).send(subjectMark)
})

const updateStudentSubjectMark = asyncHandler(async (req, res) => {
    const { Id, studentId, attendance, assessment, projectReview, projectSubmission, linkedIn_Post, percentage, total, grade } = req.body;

    const isStudentExist = await Student.findOne({ _id: studentId });
    const isExist = await SubjectMarks.findOne({ _id: Id });

    if (!isStudentExist) {
        return res.status(400).send({ message: "The student does not exist in the database." })
    }

    if (!isExist) {
        return res.status(400).send({ message: "The specified subject marks record does not exist." })
    }

    if (!attendance || !assessment || !projectReview || !projectSubmission || !linkedIn_Post || !percentage || !total || !grade) {
        return res.status(400).send({ message: "Missing data passed into request" })
    }

    let updateDetails = await SubjectMarks.findByIdAndUpdate({ _id: Id }, {
        $set: {
            attendance: attendance,
            assessment: assessment,
            project_Review: projectReview,
            project_Submission: projectSubmission,
            linkedIn_Post: linkedIn_Post,
            percentage: percentage,
            total: total,
            grade: grade,
        }
    }, { new: true }
    )
    // await updateDetails.populate('studentId', '-password')
    if (!updateDetails) {
        return res.status(400).send({ message: "Failed to update the record." });
    }
    res.status(200).send(updateDetails)
})

const deleteStudentSubjectMarks = asyncHandler(async (req, res) => {
    const isExist = await SubjectMarks.findOne({ _id: req.params.Id })

    if (!isExist) {
        return res.status(400).send({ message: "The student does not exist in the database." })
    }

    const deleteRes = await SubjectMarks.findByIdAndDelete({ _id: req.params.Id })
    if (!deleteRes) {
        return res.status(400).send({ message: "Failed to delete the record." });
    }

    res.status(200).send(deleteRes)
})

const addResultBulkData = asyncHandler(async (req, res) => {
    const { StudentMarksList } = req.body;

    if (!Array.isArray(StudentMarksList) || StudentMarksList.length === 0) {
        return res.status(400).send({ message: 'Invalid input. The list is empty or not an array.' });
    }

    const studentIds = StudentMarksList.map(data => data.studentId);
    const validStudents = await Student.find({
        _id: { $in: studentIds }
    }).select('_id');

    if (validStudents.length !== studentIds.length) {
        const validStudentIds = validStudents.map(student => student._id.toString());
        const invalidIds = studentIds.filter(id => !validStudentIds.includes(id));
        return res.status(400).send({
            message: 'Some student IDs are invalid.',
            invalidIds
        });
    }

    const existingStudents = await SubjectMarks.find({
        _id: { $in: studentIds }
    }).select('_id');

    const existingStudentIds = existingStudents.map(student => student._id.toString());
    const duplicates = StudentMarksList.filter(data => existingStudentIds.includes(data.studentId));
    const newStudentMarks = StudentMarksList.filter(data => !existingStudentIds.includes(data.studentId));

    if (duplicates.length > 0) {
        return res.status(400).send({
            message: 'Some records could not be added due to duplicate student IDs.',
            duplicates: duplicates
        });
    }

    if (newStudentMarks.length === 0) {
        return res.status(400).send({ message: 'All provided student marks already exist.' });
    }

    const BulkData = await SubjectMarks.insertMany(newStudentMarks);
    if (!BulkData) {
        return res.status(400).send({ message: "Failed to upload the record." });
    }
    res.status(200).send(BulkData);
})

module.exports = { allStudentSubjectMarksList, addStudentSubjectMarks, updateStudentSubjectMark, deleteStudentSubjectMarks, addResultBulkData }