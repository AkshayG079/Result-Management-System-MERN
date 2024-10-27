const express = require('express');
const { addStudent, deleteStudentDetail, updateStudentDetail, AllStudentDetails, addStudentBulkData } = require('../controllers/studentController');
const router = express.Router();

router.route('/').get(AllStudentDetails)
router.route('/add').post(addStudent)
router.route('/add-multiple').post(addStudentBulkData)
router.route('/update').put(updateStudentDetail);
router.route('/delete/:Id').delete(deleteStudentDetail);

module.exports = router