const asyncHandler = require('express-async-handler');
const Student = require('../models/student');
const SubjectMarks = require('../models/subjectMarks');
const Result = require('../models/result')

const AllStudentDetails = asyncHandler(async (req, res) => {
    const StudentsList = await Student.find();
    if (!StudentsList) {
        return res.status(400).send({ message: "Failed to fetch the record." });
    }
    res.status(200).send(StudentsList)
})

const addStudent = asyncHandler(async (req, res) => {
    const { name, email, ph_Num, gender, duration, domain } = req.body;
    if (!name || !email || !ph_Num || !gender || !duration || !domain) {
        return res.status(400).send({ message: "Missing data passed into request" })
    }

    const isStudentExist = await Student.findOne({ $or: [{ email }, { ph_Num }] })
    if (isStudentExist) {
        return res.status(400).send({ message: "Student with this email or phone number already exists" });
    }

    const newStudent = await Student.create({
        name,
        email,
        ph_Num,
        gender,
        duration,
        domain
    });

    res.status(200).send(newStudent)
})

const updateStudentDetail = asyncHandler(async (req, res) => {
    const { studentId, name, email, ph_Num, gender, duration, domain } = req.body;

    const isStudentExist = await Student.findOne({ _id: studentId })
    if (!isStudentExist) {
        return res.status(400).send({ message: "The student does not exist in the database." })
    }

    const updateDetails = await Student.findByIdAndUpdate({ _id: studentId }, {
        $set: {
            name: name,
            email: email,
            ph_Num: ph_Num,
            gender: gender,
            duration: duration,
            domain: domain
        }
    }, { new: true });

    res.status(200).send(updateDetails)
})

const deleteStudentDetail = asyncHandler(async (req, res) => {
    const isStudentExist = await Student.findOne({ _id: req.params.Id })
    if (!isStudentExist) {
        return res.status(400).send({ message: "The student does not exist in the database." })
    }
    const deletedStudent = await Student.findByIdAndDelete({ _id: req.params.Id })

    const isStudentMarksExist = await SubjectMarks.findOne({ studentId: req.params.Id });
    if (isStudentMarksExist) {
        await SubjectMarks.findByIdAndDelete({ _id: isStudentMarksExist._id })
    }

    const isResultExist = await Result.findOne({ studentId: req.params.Id })
    if (isResultExist) {
        await Result.findByIdAndDelete({ _id: isResultExist._id })
    }
    res.status(200).send({ message: 'Delete successfully', deletedStudent ,isResultExist,isStudentMarksExist})

})

const addStudentBulkData = asyncHandler(async (req, res) => {
    const { StudentList } = req.body;

    if (!Array.isArray(StudentList) || StudentList.length === 0) {
        return res.status(400).send({ message: 'Invalid input. The list is empty or not an array.' });
    }

    const emails = StudentList.map(student => student.email).filter(email => email);
    const phoneNumbers = StudentList.map(student => student.ph_Num).filter(ph_Num => ph_Num);

    const existingStudents = await Student.find({
        $or: [
            { email: { $in: emails } },
            { ph_Num: { $in: phoneNumbers } }
        ]
    }).select('email ph_Num');

    const existingEmails = existingStudents.map(student => student.email);
    const existingPhoneNumbers = existingStudents.map(student => student.ph_Num);

    const duplicates = StudentList.filter(student =>
        existingEmails.includes(student.email) || existingPhoneNumbers.includes(student.ph_Num)
    );

    const newStudents = StudentList.filter(student =>
        !existingEmails.includes(student.email) && !existingPhoneNumbers.includes(student.ph_Num)
    );

    if (duplicates.length > 0) {
        return res.status(400).send({
            message: 'Some records could not be added due to duplicate emails or phone numbers.',
        });
    }

    if (newStudents.length === 0) {
        return res.status(400).send({ message: 'All provided students already exist.' });
    }

    const BulkData = await Student.insertMany(newStudents);
    res.status(200).send(BulkData);
})

module.exports = { addStudent, deleteStudentDetail, updateStudentDetail, AllStudentDetails, addStudentBulkData }

