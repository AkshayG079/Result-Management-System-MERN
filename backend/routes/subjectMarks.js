const express = require("express");
const { allStudentSubjectMarksList, addStudentSubjectMarks, updateStudentSubjectMark, deleteStudentSubjectMarks, addResultBulkData } = require("../controllers/subjectMarksController");
const router = express.Router();

router.route('/').get(allStudentSubjectMarksList)
router.route('/add').post(addStudentSubjectMarks)
router.route('/add-multiple').post(addResultBulkData)
router.route('/update').put(updateStudentSubjectMark)
router.route('/delete/:Id').delete(deleteStudentSubjectMarks)

module.exports = router