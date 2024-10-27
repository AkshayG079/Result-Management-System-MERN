const asyncHandler = require('express-async-handler');
const SubjectMarks = require('../models/subjectMarks');
const Student = require('../models/student');
const Result = require('../models/result')

const AllResultList = asyncHandler(async (req, res) => {
    const list = await Result.find()
        .populate('studentId')
        .populate('subjectMarkId');
    if (!list) {
        return res.status(400).send({ message: "Failed to fetch the record." });
    }
    res.status(200).send(list);
})

const addStudentResult = asyncHandler(async (req, res) => {
    const { studentId, subjectMarkId, status, message } = req.body;

    const isStudentExist = await Student.findOne({ _id: studentId });
    if (!isStudentExist) {
        return res.status(400).send({ message: "The student does not exist in the database." })
    }
    const isSubjectMarksExist = await SubjectMarks.findOne({ _id: subjectMarkId });
    if (!isSubjectMarksExist) {
        return res.status(400).send({ message: "The specified subject marks record does not exist." })
    }

    const isResultExist = await Result.findOne({ $or: [{ subjectMarkId }, { studentId }] });
    if (isResultExist) {
        return res.status(400).send({ message: "A result with the provided subject or student ID already exists." })
    }

    const resultDetail = await Result.create({
        studentId,
        subjectMarkId,
        status: { type: status, message: message }
    })

    const isResult = await Result.findById(resultDetail._id).populate('studentId').populate('subjectMarkId')
    res.status(200).send(isResult)
})

const updateStudentResult = asyncHandler(async (req, res) => {
    const { studentId, subjectMarkId, status, message, Id } = req.body;

    const isStudentExist = await Student.findOne({ _id: studentId });
    if (!isStudentExist) {
        return res.status(400).send({ message: "The student does not exist in the database." })
    }
    const isSubjectMarksExist = await SubjectMarks.findOne({ _id: subjectMarkId });
    if (!isSubjectMarksExist) {
        return res.status(400).send({ message: "The specified subject marks record does not exist." })
    }

    const isExist = await Result.findOne({ _id: Id });
    if (!isExist) {
        return res.status(400).send({ message: " Not Exist" })
    }

    let updateResultDetail = await Result.findByIdAndUpdate({ _id: Id }, {
        studentId,
        subjectMarkId,
        status: { type: status, message: message }
    }, { new: true })
    await updateResultDetail.populate('studentId')
    await updateResultDetail.populate('subjectMarkId')
    res.status(200).send(updateResultDetail)
})

const deleteStudentResult = asyncHandler(async (req, res) => {
    const { Id } = req.params;
    const isExist = await Result.findOne({ _id: Id });
    if (!isExist) {
        return res.status(400).send({ message: "The specified subject marks record does not exist." })
    }

    const deleteRes = await Result.findByIdAndDelete({ _id: Id })
    res.status(200).send(deleteRes)
})

const searchStudentDetails = asyncHandler(async (req, res) => {
    const studentId = req.params.Id
    const isStudentExist = await Student.findOne({ _id: studentId });
    if (!isStudentExist) {
        return res.status(400).send({ message: "The student does not exist in the database." })
    }

    const isSubjectMarksExist = await SubjectMarks.findOne({ studentId: studentId });
    if (!isSubjectMarksExist) {
        return res.status(400).send({ message: "The specified subject marks record does not exist." })
    }

    const isAlreadyResultExist = await Result.findOne({ studentId: studentId })
        .populate('studentId')
        .populate('subjectMarkId')
    if (isAlreadyResultExist) {
        return res.status(200).send(isAlreadyResultExist)
    } else {
        await isSubjectMarksExist.populate('studentId')
        res.status(200).send(isSubjectMarksExist)
    }
})

module.exports = { AllResultList, addStudentResult, deleteStudentResult, updateStudentResult, searchStudentDetails }